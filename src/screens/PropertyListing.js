import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    Modal,
    ToastAndroid,
    TextInput,
    RefreshControl
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../constants/Colors';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bottomtab from '../components/Bottomtab';

const PropertyListing = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState('all');
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [listProperty, setListProperty] = useState([]);
    const [deletePropertyModal, setDeletePropertyModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filter options state
    const [filterOptions, setFilterOptions] = useState({
        p_status: '',
        type: '',
        location: '',
        budget: '',
        amenities: ''
    });

    const handleDelete = (item) => {
        setSelectedProperty(item)
        setDeletePropertyModal(true);
    };

    const DeletePropertyApi = async propertyId => {

        try {
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.delete_property}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id: propertyId,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.code === 200) {
                    ToastAndroid.show('Property Deleted Successfully', ToastAndroid.SHORT);
                    ListPropertyApi();
                } else {
                    ToastAndroid.show('Failed to delete property', ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Error fetching data:', error.message);
            ToastAndroid.show('Network error', ToastAndroid.SHORT);
        } finally {
            setDeletePropertyModal(false);
        }
    };

    const ListPropertyApi = async (filters = {}) => {
        setLoading(true);
        setRefreshing(true);
        try {
            // const requestBody = {};
            // ✅ User ID AsyncStorage se lo
            const userId = await AsyncStorage.getItem('id');

            const requestBody = {
                p_id: "",  // ✅ Blank p_id
                user_id: userId  // ✅ User ID add karo
            };



            // Agar filters hain to request body mein add karo
            if (filters.p_status && filters.p_status !== 'all') {
                requestBody.p_status = filters.p_status;
            }
            if (filters.type) {
                requestBody.type = filters.type;
            }
            if (filters.location) {
                requestBody.location = filters.location;
            }
            if (filters.budget) {
                requestBody.budget = filters.budget;
            }
            if (filters.amenities) {
                requestBody.amenities = filters.amenities;
            }

            console.log('API Request Body:', requestBody);

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_property}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                // body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : null,
            });

            const result = await response.json();

            if (result.code == 200 && result.payload) {
                setListProperty(result.payload)
            } else {
                setListProperty([]);
                console.log('❌ Error: Failed to load data');
            }
        } catch (error) {
            console.log('❌ Error fetching data:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);

        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await ListPropertyApi(); // Re-fetch data
        setRefreshing(false); // Stop refreshing once data is fetched
    };

    useFocusEffect(
        useCallback(() => {
            ListPropertyApi(); // 👈 Fetch property list whenever screen is focused
        }, [])
    );

    // Handle apply filters
    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setFilterOptions(filters);

        // API call with filters
        ListPropertyApi(filters);

        setFiltersModalVisible(false);
        console.log('Applied Filters:', filters);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setAppliedFilters(null);
        setFilterOptions({
            p_status: '',
            type: '',
            location: '',
            budget: '',
            amenities: ''
        });
        setFiltersModalVisible(false);

        // Reset API call without filters
        ListPropertyApi();
    };

    // Handle status filter change
    // Handle status filter change - Only UI filtering, no API call
    const handleStatusFilter = (status) => {
        setFilter(status);
        // ✅ No API call, only UI state change
    };

    // Filtered properties based on selected tab
    const filteredProperties = listProperty.filter(property => {
        if (filter === 'all') return true;
        return property.p_status === filter;
    });

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Sold': return '#4CAF50';
            case 'Available': return '#2196F3';
            case 'Rented': return '#FF9800';
            default: return '#666';
        }

    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'Sold': return 'Sold';
            case 'Available': return 'Available';
            case 'Rented': return 'Rented';
            default: return status;
        }
    };

    const getAmenityIcon = (amenity) => {
        const amenityIcons = {
            'Pool': 'water-outline',
            'Gym': 'barbell-outline',
            'Parking': 'car-outline',
            'Garden': 'leaf-outline',
            'Security': 'shield-checkmark-outline',
            'Lift': 'business-outline',
            'Power Backup': 'flash-outline',
            'WiFi': 'wifi-outline',
            'AC': 'snow-outline',
            'TV': 'tv-outline',
            'Fridge': 'ice-cream-outline',
            'Washing Machine': 'shirt-outline',
            'Geyser': 'flame-outline',
            'Modular Kitchen': 'restaurant-outline',
            'Clubhouse': 'home-outline',
            'Playground': 'game-controller-outline',
            'Park': 'leaf-outline',
            'Shopping Center': 'cart-outline',
            'Hospital': 'medical-outline',
            'School': 'school-outline'
        };

        return amenityIcons[amenity] || 'sparkles-outline';
    };

    // Render Filter Modal
    const renderFilterModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={filtersModalVisible}
            onRequestClose={() => setFiltersModalVisible(false)}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 12,
                    width: '90%',
                    maxHeight: '80%',
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 20,
                        textAlign: 'center',
                    }}>
                        Filter Properties
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Property Type Filter */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Property Type
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {['Residential', 'Commercial', 'Apartment', 'Villa'].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            backgroundColor: filterOptions.type === type ? colors.AppColor : '#f0f0f0',
                                            borderRadius: 6,
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilterOptions({ ...filterOptions, type })}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Medium',
                                            color: filterOptions.type === type ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Budget Filter */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Budget
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {['Low', 'Medium', 'High'].map((budget) => (
                                    <TouchableOpacity
                                        key={budget}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            backgroundColor: filterOptions.budget === budget ? colors.AppColor : '#f0f0f0',
                                            borderRadius: 6,
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilterOptions({ ...filterOptions, budget })}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Medium',
                                            color: filterOptions.budget === budget ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {budget}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Location Filter */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Location
                            </Text>
                            <View style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        color: colors.TextColorBlack,
                                    }}
                                    placeholder="Enter location..."
                                    value={filterOptions.location}
                                    onChangeText={(text) => setFilterOptions({ ...filterOptions, location: text })}
                                />
                            </View>
                        </View>

                        {/* Amenities Filter */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Amenities
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {['Pool', 'Gym', 'Parking', 'Garden', 'Security'].map((amenity) => (
                                    <TouchableOpacity
                                        key={amenity}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            backgroundColor: filterOptions.amenities === amenity ? colors.AppColor : '#f0f0f0',
                                            borderRadius: 6,
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilterOptions({ ...filterOptions, amenities: amenity })}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Medium',
                                            color: filterOptions.amenities === amenity ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {amenity}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 12,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 8,
                                marginRight: 10,
                                alignItems: 'center',
                            }}
                            onPress={clearAllFilters}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#666',
                            }}>
                                Clear All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 12,
                                backgroundColor: colors.AppColor,
                                borderRadius: 8,
                                marginLeft: 10,
                                alignItems: 'center',
                            }}
                            onPress={() => handleApplyFilters(filterOptions)}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#fff',
                            }}>
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // Render property card (same as before)
    const renderPropertyCard = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
                overflow: 'hidden',
            }}
            onPress={() => navigation.navigate('PropertyDetail', { property: item })}
        >
            {/* Property Image */}
            <View style={{ position: 'relative' }}>
                <Image
                    source={{
                        uri: item.images && item.images.length > 0
                            ? item.images[0].img_file  // 👈 yahan .img_file use karo
                            : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                    }}
                    style={{
                        width: '100%',
                        height: 180,
                    }}
                />

                {/* Status Badge */}
                <View style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: getStatusColor(item.p_status),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                }}>
                    <Text style={{
                        fontSize: 10,
                        fontFamily: 'Inter-Bold',
                        color: '#fff',
                    }}>
                        {getStatusText(item.p_status).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Property Details */}
            <View style={{ padding: 15 }}>
                {/* Title and Price */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        flex: 1,
                        marginRight: 10,
                    }}>
                        {item.product_name}
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: colors.AppColor,
                    }}>
                        {item.unit_price ? `₹${Number(item.unit_price).toLocaleString('en-IN')}` : 'Price on Request'}
                    </Text>
                </View>

                {/* Location */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        marginLeft: 4,
                        flex: 1,
                    }}>
                        {item.location}
                    </Text>
                </View>

                {/* Property Features */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="resize-outline" size={14} color="#666" />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginLeft: 4,
                        }}>
                            {item.size}
                        </Text>
                    </View>
                </View>

                {/* Amenities */}
                {item.amenities && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                        {item.amenities.split(',').slice(0, 3).map((amenity, index) => (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 12,
                                marginBottom: 4
                            }}>
                                <Ionicons name={getAmenityIcon(amenity.trim())} size={12} color="#666" />
                                <Text style={{
                                    fontSize: 11,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                    marginLeft: 4,
                                }}>
                                    {amenity.trim()}
                                </Text>
                            </View>
                        ))}
                        {item.amenities.split(',').length > 3 && (
                            <Text style={{ fontSize: 11, color: '#666' }}>
                                +{item.amenities.split(',').length - 3} more
                            </Text>
                        )}
                    </View>
                )}

                {/* Actions */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    paddingTop: 12,
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 6,
                            marginRight: 10,
                        }}
                        onPress={() => navigation.navigate('AgentAddProperty', { property: item })}
                    >
                        <Ionicons name="create-outline" size={14} color={colors.AppColor} />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Medium',
                            color: colors.AppColor,
                            marginLeft: 4,
                        }}>
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: '#fff0f0',
                            borderRadius: 6,
                        }}
                        onPress={() => handleDelete(item)}
                    >
                        <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Medium',
                            color: '#FF3B30',
                            marginLeft: 4,
                        }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>

            {/* Loader Overlay */}
            {/* {loading && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 999,
                    }}
                >
                    <Ionicons name="hourglass-outline" size={40} color={colors.AppColor} />
                    <Text
                        style={{
                            marginTop: 10,
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.AppColor,
                        }}
                    >
                        Loading properties...
                    </Text>
                </View>
            )} */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.AppColor]}
                        tintColor={colors.AppColor}
                    />
                }>
                {/* Header */}
                <Header
                    title="My Properties"
                    onBackPress={() => navigation.goBack()}
                    rightComponent={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* Filter Button */}
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    backgroundColor: appliedFilters ? colors.AppColor : '#f8f9fa',
                                    marginRight: 10,
                                    position: 'relative',
                                }}
                                onPress={() => setFiltersModalVisible(true)}
                            >
                                <Ionicons
                                    name="filter"
                                    size={20}
                                    color={appliedFilters ? '#fff' : colors.TextColorBlack}
                                />

                                {/* Filter Active Indicator */}
                                {appliedFilters && (
                                    <View style={{
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        backgroundColor: '#FF3B30',
                                        borderRadius: 6,
                                        width: 12,
                                        height: 12,
                                    }} />
                                )}
                            </TouchableOpacity>

                            {/* Add Property Button */}
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    backgroundColor: colors.AppColor,
                                }}
                                onPress={() => navigation.navigate('AgentAddProperty')}
                            >
                                <Ionicons name="add" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    }
                />

                {/* Applied Filters Display */}
                {appliedFilters && (
                    <View style={{
                        backgroundColor: '#E3F2FD',
                        margin: 10,
                        padding: 12,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.AppColor,
                                marginBottom: 4,
                            }}>
                                Filters Applied
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                            }}>
                                {Object.values(appliedFilters).filter(val => val && val !== '').length} filters active
                            </Text>
                        </View>

                        <TouchableOpacity onPress={clearAllFilters}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#FF3B30',
                            }}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Stats Summary */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 20,
                    backgroundColor: '#fff',
                    margin: 10,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Inter-Bold',
                            color: colors.AppColor,
                        }}>
                            {listProperty.length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Total
                        </Text>
                    </View>



                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Inter-Bold',
                            color: '#2196F3',
                        }}>
                            {listProperty.filter(p => p.p_status === 'Available').length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Available
                        </Text>
                    </View>

                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Inter-Bold',
                            color: '#FF9800',
                        }}>
                            {listProperty.filter(p => p.p_status === 'Rented').length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Rented
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Inter-Bold',
                            color: '#4CAF50',
                        }}>
                            {listProperty.filter(p => p.p_status === 'Sold').length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Sold
                        </Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                    padding: 5,
                }}>
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'Available', label: 'Available' },
                        { key: 'Rented', label: 'Rented' },
                        { key: 'Sold', label: 'Sold' },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={{
                                flex: 1,
                                paddingVertical: 8,
                                alignItems: 'center',
                                borderRadius: 6,
                                backgroundColor: filter === tab.key ? colors.AppColor : 'transparent',
                            }}
                            onPress={() => handleStatusFilter(tab.key)}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: filter === tab.key ? '#fff' : colors.TextColorBlack,
                            }}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Loading State */}
                {/* {loading && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text>Loading properties...</Text>
                    </View>
                )} */}

                {/* Properties List */}
                <View style={{ padding: 10, flex: 1, }}>
                    {loading ? (
                        <View style={{
                            padding: 40,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ionicons name="hourglass-outline" size={40} color={colors.AppColor} />
                            <Text style={{
                                marginTop: 12,
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.AppColor,
                            }}>
                                Loading properties...
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProperties}
                            renderItem={renderPropertyCard}
                            keyExtractor={item => item.p_id.toString()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#2196F3']} // optional spinner color
                                />
                            }
                            ListEmptyComponent={
                                !loading && listProperty.length === 0 ? (
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 50
                                    }}>
                                        <Image
                                            source={require('../assets/images/Property.png')}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                marginBottom: 15,
                                                resizeMode: 'contain'
                                            }}
                                        />
                                        <Text style={{
                                            fontSize: 16,
                                            color: colors.red,
                                            fontFamily: 'Inter-Medium'
                                        }}>
                                            No Property Yet
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#666',
                                            marginTop: 8,
                                            textAlign: 'center',
                                            fontFamily: 'Inter-Regular'
                                        }}>
                                            Start by adding your first property
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.AppColor,
                                                paddingHorizontal: 20,
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                marginTop: 15
                                            }}
                                            onPress={() => navigation.navigate('AgentAddProperty')}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#fff',
                                                fontFamily: 'Inter-Medium'
                                            }}>
                                                Add First Property
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            }

                        />
                    )}
                </View>



                {/* Delete Confirmation Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={deletePropertyModal}
                    onRequestClose={() => {
                        setDeletePropertyModal(false);
                    }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onPress={() => {
                            setDeletePropertyModal(false);
                        }}
                        activeOpacity={1}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                                borderRadius: 8,
                                width: '80%',
                                alignItems: 'center',
                            }}
                            onStartShouldSetResponder={() => true}
                            onTouchEnd={e => e.stopPropagation()}>
                            <Text style={{
                                fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black', fontFamily: 'Inter-Medium'
                            }}>
                                Confirm Delete
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
                                Are you sure you want to delete the Property?
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#ddd',
                                        padding: 10,
                                        borderRadius: 5,
                                        width: '45%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        setDeletePropertyModal(false);
                                    }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                            fontFamily: 'Inter-Regular',
                                        }}>
                                        No
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.AppColor,
                                        padding: 10,
                                        borderRadius: 5,
                                        width: '45%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        DeletePropertyApi(selectedProperty.p_id);
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontFamily: 'Inter-Regular',
                                        }}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Filter Modal */}
                {renderFilterModal()}
            </ScrollView>
            <Bottomtab />
        </SafeAreaView>
    );
};

export default PropertyListing;