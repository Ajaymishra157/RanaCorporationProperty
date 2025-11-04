import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/Colors';
import Header from '../components/Header';

const Favorites = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Sample favorites data
    const sampleFavorites = [
        {
            id: 1,
            title: 'Luxury 3BHK Apartment',
            type: 'Apartment',
            price: '₹85,00,000',
            location: 'Sector 15, Gurgaon',
            area: '1800 sq ft',
            bedrooms: 3,
            bathrooms: 2,
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
            addedDate: '2024-01-20',
            views: 245,
            isAvailable: true
        },
        {
            id: 2,
            title: 'Modern 2BHK Flat',
            type: 'Flat',
            price: '₹45,00,000',
            location: 'DLF Phase 2',
            area: '1200 sq ft',
            bedrooms: 2,
            bathrooms: 2,
            image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
            addedDate: '2024-01-18',
            views: 189,
            isAvailable: true
        },
        {
            id: 3,
            title: 'Spacious Villa',
            type: 'Villa',
            price: '₹2,50,00,000',
            location: 'Sector 42',
            area: '3500 sq ft',
            bedrooms: 4,
            bathrooms: 3,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
            addedDate: '2024-01-15',
            views: 567,
            isAvailable: false
        },
        {
            id: 4,
            title: 'Penthouse with View',
            type: 'Penthouse',
            price: '₹3,50,00,000',
            location: 'Golf Course Road',
            area: '2800 sq ft',
            bedrooms: 3,
            bathrooms: 3,
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
            addedDate: '2024-01-12',
            views: 321,
            isAvailable: true
        }
    ];

    // Load favorites on component mount
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = () => {
        // In real app, you would fetch from AsyncStorage or API
        setFavorites(sampleFavorites);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadFavorites();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const removeFromFavorites = (propertyId) => {
        Alert.alert(
            'Remove from Favorites',
            'Are you sure you want to remove this property from favorites?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        const updatedFavorites = favorites.filter(item => item.id !== propertyId);
                        setFavorites(updatedFavorites);
                        // Here you would also update in AsyncStorage or API
                    }
                }
            ]
        );
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
                    onPress: () => {
                        setFavorites([]);
                        // Here you would also clear from AsyncStorage or API
                    }
                }
            ]
        );
    };

    // Render favorite property card
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
            onPress={() => navigation.navigate('PropertyDetail', { property: item })}
        >
            <View style={{ flexDirection: 'row' }}>
                {/* Property Image */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: 120,
                            height: 120,
                        }}
                        resizeMode="cover"
                    />

                    {/* Sold Out Badge */}
                    {!item.isAvailable && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(255,0,0,0.8)',
                            paddingVertical: 4,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 10,
                                fontFamily: 'Inter-Bold',
                                color: '#fff',
                            }}>
                                SOLD OUT
                            </Text>
                        </View>
                    )}
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
                            {item.title}
                        </Text>

                        <TouchableOpacity
                            style={{ padding: 4 }}
                            onPress={() => removeFromFavorites(item.id)}
                        >
                            <Ionicons name="heart" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>

                    {/* Price */}
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.AppColor,
                        marginVertical: 4,
                    }}>
                        {item.price}
                    </Text>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Ionicons name="location-outline" size={12} color="#666" />
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                            <Ionicons name="bed-outline" size={12} color="#666" />
                            <Text style={{
                                fontSize: 11,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginLeft: 4,
                            }}>
                                {item.bedrooms} Beds
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                            <Ionicons name="water-outline" size={12} color="#666" />
                            <Text style={{
                                fontSize: 11,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginLeft: 4,
                            }}>
                                {item.bathrooms} Baths
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="resize-outline" size={12} color="#666" />
                            <Text style={{
                                fontSize: 11,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginLeft: 4,
                            }}>
                                {item.area}
                            </Text>
                        </View>
                    </View>

                    {/* Added Date and Views */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Inter-Regular',
                            color: '#999',
                        }}>
                            Added: {item.addedDate}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="eye-outline" size={10} color="#999" />
                            <Text style={{
                                fontSize: 10,
                                fontFamily: 'Inter-Regular',
                                color: '#999',
                                marginLeft: 4,
                            }}>
                                {item.views} views
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Header
                    title="My Favorites"
                    onBackPress={() => navigation.goBack()}
                    rightComponent={
                        favorites.length > 0 ? (
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    backgroundColor: '#f8f9fa',
                                }}
                                onPress={clearAllFavorites}
                            >
                                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        ) : null
                    }
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
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Favorites;