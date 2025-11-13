import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    Alert,
    ActivityIndicator,
    RefreshControl,
    ToastAndroid
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colors from '../constants/Colors';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Favorites = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load favorites from API
    const loadFavorites = async () => {
        try {
            const customer_id = await AsyncStorage.getItem('id');
            setRefreshing(true);
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_wishlist}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add any required body parameters if needed
                body: JSON.stringify({ customer_id: customer_id })
            });

            const result = await response.json();
            console.log('Wishlist API Response:', result);

            if (result.code == 200 && result.payload) {
                // Filter out entries where property_id is null
                const validFavorites = result.payload.filter(item => item.wishlist_id !== null);
                setFavorites(validFavorites);
            } else {
                console.log(result.message || 'Failed to load favorites');
                setFavorites([]);
            }
        } catch (error) {
            console.log('Error loading favorites:', error);

            setFavorites([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load favorites when component mounts and when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const handleRefresh = () => {
        loadFavorites();
    };

    const removeFromFavorites = (propertyId, propertyName) => {
        Alert.alert(
            'Remove from Favorites',
            `Are you sure you want to remove "${propertyName}" from favorites?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFromWishlist(propertyId)
                }
            ]
        );
    };

    const removeFromWishlist = async (propertyId) => {
        try {

            const customer_id = await AsyncStorage.getItem('id');





            const url = `${ApiConstant.URL}${ApiConstant.OtherURL.delete_wishlist}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: customer_id,
                    p_id: propertyId
                }),
            });

            const result = await response.json();
            console.log("Remove wishlist response:", result);

            if (result.code == 200) {


                ToastAndroid.show("Property removed from wishlist", ToastAndroid.SHORT);
                loadFavorites();
            } else {
                console.log(result.message || 'Failed to remove from wishlist');
            }
        } catch (error) {
            console.log('Remove from wishlist error:', error);
            console.log('Network request failed');
        }
    };

    const clearAllFavorites = () => {
        if (favorites.length === 0) return;

        Alert.alert(
            'Clear All Favorites',
            'Are you sure you want to remove all properties from favorites?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: clearAllFavoritesAPI
                }
            ]
        );
    };

    const clearAllFavoritesAPI = async () => {
        try {
            // You might need to implement a bulk delete API or delete one by one
            // For now, we'll clear locally and show success message
            setFavorites([]);
            Alert.alert('Success', 'All favorites cleared successfully');

            // If you have a bulk delete API, implement it here
            // const response = await fetch(`${ApiConstant.URL}wishlist/clear_wishlist.php`, {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({ customer_id: '75' })
            // });
        } catch (error) {
            console.log('Error clearing favorites:', error);
            Alert.alert('Error', 'Failed to clear favorites');
        }
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get time ago from date
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    // Render favorite property card based on API response
    const renderFavoriteCard = ({ item }) => (
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
        // onPress={() => {
        //     if (item.property_id) {
        //         navigation.navigate('PropertyDetail', {
        //             propertyId: item.property_id,
        //             propertyName: item.property_name
        //         });
        //     }
        // }}
        >
            <View style={{ flexDirection: 'row' }}>
                {/* Property Image - Using placeholder for now */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{
                            uri: item.property_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                        }}
                        style={{
                            width: 120,
                            height: 120,
                        }}
                        resizeMode="cover"
                        defaultSource={require('../assets/images/property1.jpg')}
                    />

                    {/* Favorite Badge */}
                    <View style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'rgba(255,59,48,0.9)',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                    }}>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Inter-Bold',
                            color: '#fff',
                        }}>
                            FAVORITE
                        </Text>
                    </View>
                </View>

                {/* Property Details */}
                <View style={{ flex: 1, padding: 12 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Inter-Bold',
                            color: colors.TextColorBlack,
                            flex: 1,
                            marginRight: 10,
                        }}>
                            {item.property_name || 'Property Name Not Available'}
                        </Text>

                        <TouchableOpacity
                            style={{ padding: 4 }}
                            onPress={() => removeFromFavorites(item.property_id, item.property_name)}
                        >
                            <Ionicons name="heart" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>

                    {/* Property ID */}
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        marginBottom: 4,
                    }}>
                        ID: {item.property_id || 'N/A'}
                    </Text>

                    {/* Customer Info */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Ionicons name="person-outline" size={12} color="#666" />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                            marginLeft: 4,
                            flex: 1,
                        }}>
                            Added by: {item.customer_name}
                        </Text>
                    </View>

                    {/* Added Date */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name="calendar-outline" size={12} color="#666" />
                        <Text style={{
                            fontSize: 11,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginLeft: 4,
                        }}>
                            {formatDate(item.wishlist_entry_date)}
                        </Text>
                    </View>

                    {/* Time Ago */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                    }}>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Inter-Regular',
                            color: '#999',
                            fontStyle: 'italic',
                        }}>
                            {getTimeAgo(item.wishlist_entry_date)}
                        </Text>

                        {/* <View style={{
                            backgroundColor: colors.AppColor + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                        }}>
                            <Text style={{
                                fontSize: 10,
                                fontFamily: 'Inter-Bold',
                                color: colors.AppColor,
                            }}>
                                Wishlist ID: {item.wishlist_id}
                            </Text>
                        </View> */}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                <Header
                    title="My Favorites"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.AppColor} />
                    <Text style={{
                        marginTop: 12,
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        Loading your favorites...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.AppColor]}
                        tintColor={colors.AppColor}
                    />
                }
            >
                {/* Header */}
                <Header
                    title="My Favorites"
                    onBackPress={() => navigation.goBack()}
                // rightComponent={
                //     favorites.length > 0 ? (
                //         <TouchableOpacity
                //             style={{
                //                 padding: 8,
                //                 borderRadius: 8,
                //                 backgroundColor: '#f8f9fa',
                //             }}
                //             onPress={clearAllFavorites}
                //         >
                //             <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                //         </TouchableOpacity>
                //     ) : null
                // }
                />

                {/* Stats Card */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    margin: 10,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{
                                fontSize: 24,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                            }}>
                                {favorites.length}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                            }}>
                                Saved Properties
                            </Text>
                        </View>

                        <View style={{
                            backgroundColor: colors.AppColor + '20',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="heart" size={24} color={colors.AppColor} />
                        </View>
                    </View>
                </View>

                {/* Favorites List */}
                <View style={{ padding: 10 }}>
                    {favorites.length === 0 ? (
                        // Empty State
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 60,
                        }}>
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}>
                                <Ionicons name="heart-outline" size={40} color="#ccc" />
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                No Favorites Yet
                            </Text>

                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                textAlign: 'center',
                                marginBottom: 20,
                                lineHeight: 20,
                            }}>
                                Start saving your favorite properties{'\n'}by tapping the heart icon
                            </Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.AppColor,
                                    paddingHorizontal: 24,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                }}
                                onPress={() => navigation.navigate('PropertyListing')}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    color: '#fff',
                                }}>
                                    Browse Properties
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={favorites}
                            renderItem={renderFavoriteCard}
                            keyExtractor={item => item.wishlist_id.toString()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Favorites;