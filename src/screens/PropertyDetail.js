import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    Linking
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import colors from '../constants/Colors';
import Header from '../components/Header';

const { width: screenWidth } = Dimensions.get('window');

const PropertyDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { property } = route.params;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollViewRef = useRef();
    const autoScrollRef = useRef();


    // Sample property data with multiple images and videos
    const propertyData = {
        ...property,
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',

        ],
        videos: [
            {
                id: 1,
                thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                duration: '2:30'
            }
        ],
        description: 'This luxurious 3BHK apartment offers modern amenities and premium finishes. Located in the heart of Sector 15, it provides easy access to schools, hospitals, and shopping centers. The apartment features spacious rooms, modular kitchen, and beautiful flooring throughout.',
        amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup', 'Lift', 'Garden', 'Club House'],
        specifications: [
            { label: 'Carpet Area', value: '1650 sq ft' },
            { label: 'Built-up Area', value: '1800 sq ft' },
            { label: 'Floor', value: '12th' },
            { label: 'Total Floors', value: '15' },
            { label: 'Furnishing', value: 'Semi-Furnished' },
            { label: 'Age', value: '2 Years' },
        ],
        location: {
            latitude: 28.4595,
            longitude: 77.0266,
            address: 'Sector 15, Gurgaon, Haryana 122001'
        },
        owner: {
            name: 'Rajesh Kumar',
            phone: '+91 9876543210',
            email: 'rajesh.kumar@example.com'
        },
        postedDate: 'January 15, 2024'
    };


    // Auto scroll effect
    useEffect(() => {
        const autoScroll = () => {
            const nextIndex = (activeImageIndex + 1) % propertyData.images.length;
            scrollToImage(nextIndex);
        };

        // 3 seconds ke baad automatically next image
        autoScrollRef.current = setTimeout(autoScroll, 3000);

        return () => {
            if (autoScrollRef.current) {
                clearTimeout(autoScrollRef.current);
            }
        };
    }, [activeImageIndex]);

    // Handle image scroll
    const handleImageScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setActiveImageIndex(index);

        // Auto scroll reset karein
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current);
        }
        autoScrollRef.current = setTimeout(() => {
            const nextIndex = (index + 1) % propertyData.images.length;
            scrollToImage(nextIndex);
        }, 3000);
    }

    // Scroll to specific image
    // Scroll to specific image
    const scrollToImage = (index) => {
        setActiveImageIndex(index);
        scrollViewRef.current?.scrollTo({
            x: index * screenWidth,
            animated: true
        });
    };

    // Handle call owner
    const handleCallOwner = () => {
        Linking.openURL(`tel:${propertyData.owner.phone}`);
    };

    // Handle message owner
    const handleMessageOwner = () => {
        Linking.openURL(`whatsapp://send?phone=${propertyData.owner.phone}`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Header
                    title="Property Details"
                    onBackPress={() => navigation.goBack()}
                />

                {/* Image Carousel */}
                <View style={{ height: 300 }}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleImageScroll}
                        scrollEventThrottle={16}
                        onTouchStart={() => {
                            // User touch kare toh auto scroll stop ho jaye
                            if (autoScrollRef.current) {
                                clearTimeout(autoScrollRef.current);
                            }
                        }}
                        onTouchEnd={() => {
                            // User touch khatam hone ke 3 seconds baad auto scroll restart
                            autoScrollRef.current = setTimeout(() => {
                                const nextIndex = (activeImageIndex + 1) % propertyData.images.length;
                                scrollToImage(nextIndex);
                            }, 3000);
                        }}
                    >
                        {propertyData.images.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image }}
                                style={{
                                    width: screenWidth,
                                    height: 300,
                                }}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Image Indicators */}
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                        {propertyData.images.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: activeImageIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
                                    marginHorizontal: 4,
                                }}
                                onPress={() => {
                                    scrollToImage(index);
                                    // Manual click par bhi auto scroll reset ho
                                    if (autoScrollRef.current) {
                                        clearTimeout(autoScrollRef.current);
                                    }
                                    autoScrollRef.current = setTimeout(() => {
                                        const nextIndex = (index + 1) % propertyData.images.length;
                                        scrollToImage(nextIndex);
                                    }, 3000);
                                }}
                            />
                        ))}
                    </View>

                    {/* Favorite Button */}
                    <TouchableOpacity style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="heart-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Property Basic Info */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 8,
                    }}>
                        {propertyData.title}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                            marginLeft: 6,
                            flex: 1,
                        }}>
                            {propertyData.location.address}
                        </Text>
                    </View>

                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'Inter-Bold',
                        color: colors.AppColor,
                        marginBottom: 15,
                    }}>
                        {propertyData.price}
                    </Text>

                    {/* Property Features */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        borderTopWidth: 1,
                        borderTopColor: '#f0f0f0',
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                        paddingVertical: 15,
                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="bed-outline" size={24} color={colors.AppColor} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginTop: 4,
                            }}>
                                {propertyData.bedrooms} Beds
                            </Text>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="water-outline" size={24} color={colors.AppColor} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginTop: 4,
                            }}>
                                {propertyData.bathrooms} Baths
                            </Text>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="resize-outline" size={24} color={colors.AppColor} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginTop: 4,
                            }}>
                                {propertyData.area}
                            </Text>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="business-outline" size={24} color={colors.AppColor} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginTop: 4,
                            }}>
                                {propertyData.type}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 12,
                    }}>
                        Description
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        lineHeight: 20,
                    }}>
                        {propertyData.description}
                    </Text>
                </View>

                {/* Specifications */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 12,
                    }}>
                        Specifications
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                        {propertyData.specifications.map((spec, index) => (
                            <View key={index} style={{ width: '48%', marginBottom: 12 }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Inter-Regular',
                                    color: '#666',
                                    marginBottom: 2,
                                }}>
                                    {spec.label}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                }}>
                                    {spec.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Amenities */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 12,
                    }}>
                        Amenities
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>
                        {propertyData.amenities.map((amenity, index) => (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#f8f9fa',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 16,
                                marginRight: 8,
                                marginBottom: 8,
                            }}>
                                <Ionicons name="checkmark" size={14} color="#4CAF50" />
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                    marginLeft: 4,
                                }}>
                                    {amenity}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Map View */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                    height: 250,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 12,
                    }}>
                        Location
                    </Text>
                    <MapView
                        style={{ flex: 1, borderRadius: 8 }}
                        initialRegion={{
                            latitude: propertyData.location.latitude,
                            longitude: propertyData.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: propertyData.location.latitude,
                                longitude: propertyData.location.longitude,
                            }}
                            title={propertyData.title}
                            description={propertyData.location.address}
                        />
                    </MapView>
                </View>

                {/* Contact Owner */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                    marginBottom: 20,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 12,
                    }}>
                        Contact Owner
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: colors.AppColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Inter-Bold',
                                color: '#fff',
                            }}>
                                {propertyData.owner.name.charAt(0)}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                            }}>
                                {propertyData.owner.name}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                            }}>
                                Property Owner
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#4CAF50',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginRight: 8,
                            }}
                            onPress={handleCallOwner}
                        >
                            <Ionicons name="call" size={18} color="#fff" />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#fff',
                                marginLeft: 8,
                            }}>
                                Call
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#25D366',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginLeft: 8,
                            }}
                            onPress={handleMessageOwner}
                        >
                            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#fff',
                                marginLeft: 8,
                            }}>
                                WhatsApp
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom Action Bar */}
            <View style={{
                backgroundColor: '#fff',
                padding: 15,
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                    }}>
                        {propertyData.price}
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                    }}>
                        Posted on {propertyData.postedDate}
                    </Text>
                </View>

                <TouchableOpacity style={{
                    backgroundColor: colors.AppColor,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: '#fff',
                    }}>
                        Schedule Visit
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PropertyDetail;