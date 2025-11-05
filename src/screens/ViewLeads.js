import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import colors from '../constants/Colors';


const ViewLeads = () => {
    const [enquiryData, setEnquiryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigation = useNavigation();

    const limit = 5; // ✅ Load 5 items per page

    const fetchEnquiries = async (pageNo = 1, append = false) => {
        if (loading || loadingMore) return;

        pageNo === 1 ? setLoading(true) : setLoadingMore(true);
        try {
            const body = JSON.stringify({
                enquiry_id: '',
                page_no: pageNo,
                limit: limit,
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

                // ✅ If fewer than limit items are returned, no more pages left
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
            fetchEnquiries(1, false);
        }, [])
    );

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEnquiries(nextPage, true);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatTime = (d) =>
        new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

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
                <View
                    style={{
                        backgroundColor: lead.status === 'Active' ? '#e8f5e8' : '#ffe6e6',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 10,
                            fontFamily: 'Inter-Medium',
                            color: lead.status === 'Active' ? '#2e7d32' : '#c62828',
                        }}
                    >
                        {lead.status}
                    </Text>
                </View>
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
                    onPress={() => console.log('Calling:', lead.mobile)}
                >
                    <Ionicons name="call" size={10} color={colors.TextColorWhite} />
                    <Text style={{ fontSize: 10, color: colors.TextColorWhite, marginLeft: 4 }}>Call</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header title="All Leads" onBackPress={() => navigation.goBack()} />
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
                                No leads found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default ViewLeads;
