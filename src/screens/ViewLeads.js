import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Linking,
    ToastAndroid,
    TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import colors from '../constants/Colors';
import Bottomtab from '../components/Bottomtab';
import StatusModal from '../components/StatusModal';

const ViewLeads = () => {
    const [enquiryData, setEnquiryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigation = useNavigation();

    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    // ✅ NEW STATES FOR SEARCH AND FILTER
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const limit = 5;

    // ✅ UPDATED FETCH FUNCTION WITH SEARCH AND FILTER
    const fetchEnquiries = async (pageNo = 1, append = false, search = '', filter = 'All') => {
        if (loading || loadingMore) return;

        pageNo === 1 ? setLoading(true) : setLoadingMore(true);
        try {
            const body = JSON.stringify({
                enquiry_id: '',
                page_no: pageNo,
                limit: limit,
                search: search, // ✅ ADD SEARCH PARAMETER
                status: filter === 'All' ? '' : filter // ✅ ADD FILTER PARAMETER
            });

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_enquiry}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            const result = await response.json();

            if (result.code === 200 && Array.isArray(result.payload)) {
                const newData = result.payload;
                if (append) {
                    setEnquiryData(prev => [...prev, ...newData]);
                } else {
                    setEnquiryData(newData);
                }

                if (newData.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } else {
                setHasMore(false);
                if (!append) setEnquiryData([]);
            }
        } catch (error) {
            console.log('❌ Error fetching enquiry data:', error.message);
            setHasMore(false);
            if (!append) setEnquiryData([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            fetchEnquiries(1, false, searchQuery, selectedFilter);
        }, [])
    );

    // ✅ HANDLE SEARCH
    const handleSearch = (text) => {
        setSearchQuery(text);
        setPage(1);
        // Add debounce here if needed
        fetchEnquiries(1, false, text, selectedFilter);
    };

    // ✅ HANDLE FILTER CHANGE
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setFilterModalVisible(false);
        setPage(1);
        fetchEnquiries(1, false, searchQuery, filter);
    };

    // ✅ CLEAR SEARCH AND FILTER
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedFilter('All');
        setPage(1);
        fetchEnquiries(1, false, '', 'All');
    };

    const openStatusModal = (lead, event) => {
        const { pageX, pageY } = event.nativeEvent;

        setSelectedLead(lead);
        setModalPosition({
            top: pageY - 15,
            left: pageX - 150
        });
        setStatusModalVisible(true);
    };

    const closeStatusModal = () => {
        setStatusModalVisible(false);
        setSelectedLead(null);
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedLead) {
            ToastAndroid.show('No lead selected', ToastAndroid.SHORT);
            return;
        }

        try {
            const payload = {
                enquiry_id: selectedLead.enquiry_id.toString(),
                status: newStatus
            };

            console.log('Sending status update:', payload);
            const url = `${ApiConstant.URL}${ApiConstant.OtherURL.change_enquiry_status}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            console.log('Status update response:', result);

            if (result.code === 200) {
                ToastAndroid.show(result.message || `Status updated to ${newStatus}`, ToastAndroid.SHORT);

                setEnquiryData(prevData =>
                    prevData.map(lead =>
                        lead.enquiry_id === selectedLead.enquiry_id
                            ? { ...lead, status: newStatus }
                            : lead
                    )
                );

                setStatusModalVisible(false);
                setSelectedLead(null);

            } else {
                const errorMessage = result.message || 'Failed to update status';
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log('Status update error:', error);
            ToastAndroid.show('Network error. Please try again.', ToastAndroid.SHORT);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approve':
                return { bg: '#e8f5e8', text: '#2e7d32' };
            case 'Reject':
                return { bg: '#ffe6e6', text: '#c62828' };
            case 'Pending':
                return { bg: '#fff3e0', text: '#ef6c00' };
            default:
                return { bg: '#f5f5f5', text: '#666' };
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEnquiries(nextPage, true, searchQuery, selectedFilter);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatTime = (d) =>
        new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // ✅ FILTER MODAL COMPONENT
    const FilterModal = () => {
        if (!filterModalVisible) return null;

        const filters = ['All', 'Pending', 'Approve', 'Reject'];

        return (
            <View
                style={{
                    position: 'absolute',
                    top: 60,
                    right: 12,
                    backgroundColor: colors.TextColorWhite,
                    borderRadius: 8,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    zIndex: 1000,
                    minWidth: 120,
                }}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            borderBottomWidth: filter !== 'Reject' ? 1 : 0,
                            borderBottomColor: '#f0f0f0',
                        }}
                        onPress={() => handleFilterChange(filter)}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: selectedFilter === filter ? colors.AppColor : colors.TextColorBlack,
                            }}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderItem = ({ item: lead }) => (
        <TouchableOpacity
            key={lead.enquiry_id}
            style={{
                backgroundColor: colors.TextColorWhite,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter-Bold', color: colors.TextColorBlack }}>
                        {lead.name || 'No Name'}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.Grey, fontFamily: 'Inter-Regular' }}>
                        ID: {lead.enquiry_id}
                    </Text>
                </View>

                {/* ✅ STATUS BUTTON - CLICKABLE */}
                <TouchableOpacity
                    style={{
                        backgroundColor: getStatusColor(lead.status).bg,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                        minWidth: 60,
                    }}
                    onPress={(event) => openStatusModal(lead, event)}
                >
                    <Text
                        style={{
                            fontSize: 10,
                            fontFamily: 'Inter-Medium',
                            color: getStatusColor(lead.status).text,
                        }}
                    >
                        {lead.status}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contact Info */}
            <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: colors.Grey }}>
                    📞 {lead.mobile || 'N/A'}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: colors.Grey }}>
                    ✉️ {lead.email || 'N/A'}
                </Text>
            </View>

            {/* City & Address */}
            <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: colors.Grey }}>
                📍 {lead.city_name || 'N/A'}
            </Text>
            <Text
                style={{
                    fontSize: 12,
                    fontFamily: 'Inter-Regular',
                    color: colors.TextColorBlack,
                    marginBottom: 8,
                }}
            >
                {lead.address || 'No address provided'}
            </Text>

            {/* Footer */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    paddingTop: 8,
                }}
            >
                <Text style={{ fontSize: 10, color: colors.Grey, fontFamily: 'Inter-Regular' }}>
                    {formatDate(lead.enquiry_date)} • {formatTime(lead.enquiry_date)}
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.AppColor,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        if (lead.mobile) {
                            Linking.openURL(`tel:${lead.mobile}`);
                        } else {
                            ToastAndroid.show('Mobile number not available', ToastAndroid.SHORT);
                        }
                    }}
                >
                    <Ionicons name="call" size={10} color={colors.TextColorWhite} />
                    <Text style={{ fontSize: 10, color: colors.TextColorWhite, marginLeft: 4, fontFamily: 'Inter-Regular' }}>Call</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header title="All Leads" onBackPress={() => navigation.goBack()} />

            {/* ✅ SEARCH AND FILTER BAR */}
            <View style={{ flexDirection: 'row', padding: 12, paddingBottom: 0 }}>
                {/* SEARCH INPUT - LEFT SIDE */}
                <View style={{ flex: 1, marginRight: 8 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            height: 40,
                        }}
                    >
                        <Ionicons name="search" size={18} color={colors.Grey} />
                        <TextInput
                            style={{
                                flex: 1,
                                marginLeft: 8,
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Search by name or mobile..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholderTextColor={colors.Grey}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => handleSearch('')}>
                                <Ionicons name="close-circle" size={18} color={colors.Grey} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* FILTER BUTTON - RIGHT SIDE */}
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.AppColor,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            height: 40,
                            minWidth: 80,
                            justifyContent: 'center',
                        }}
                        onPress={() => setFilterModalVisible(!filterModalVisible)}
                    >
                        <Text style={{ fontSize: 14, fontFamily: 'Inter-Medium', color: colors.TextColorWhite, marginRight: 4 }}>
                            {selectedFilter}
                        </Text>
                        <Ionicons name="filter" size={16} color={colors.TextColorWhite} />
                    </TouchableOpacity>

                    {/* FILTER DROPDOWN MODAL */}
                    <FilterModal />
                </View>
            </View>

            {/* CLEAR FILTERS BUTTON */}
            {(searchQuery !== '' || selectedFilter !== 'All') && (
                <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: '#f8f8f8',
                            borderRadius: 6,
                        }}
                        onPress={clearFilters}
                    >
                        <Ionicons name="close" size={14} color={colors.Grey} />
                        <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: colors.Grey, marginLeft: 4 }}>
                            Clear filters
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.AppColor} />
                    <Text style={{ marginTop: 8, fontFamily: 'Inter-Medium', color: colors.Grey }}>
                        Loading Leads...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={enquiryData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ padding: 12 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={{ paddingVertical: 12 }}>
                                <ActivityIndicator size="small" color={colors.AppColor} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 80 }}>
                            <Ionicons name="people-outline" size={50} color={colors.Grey} />
                            <Text style={{ fontFamily: 'Inter-Regular', color: colors.Grey, marginTop: 8 }}>
                                {searchQuery || selectedFilter !== 'All' ? 'No matching leads found' : 'No leads found'}
                            </Text>
                        </View>
                    }
                />
            )}
            <StatusModal
                visible={statusModalVisible}
                onClose={closeStatusModal}
                onStatusChange={handleStatusUpdate}
                position={modalPosition}
                selectedLead={selectedLead}
            />
            <Bottomtab />
        </View>
    );
};

export default ViewLeads;