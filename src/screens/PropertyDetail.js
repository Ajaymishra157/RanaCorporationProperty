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

    // ✅ CORRECTLY EXTRACT IMAGES FROM PROPERTY DATA
    const getPropertyImages = () => {
        if (!property.images || property.images.length === 0) {
            return ['https://cdn-icons-png.flaticon.com/512/814/814513.png'];
        }

        // ✅ Check if images is array of objects (with img_file property)
        if (typeof property.images[0] === 'object' && property.images[0].img_file) {
            return property.images.map(imgObj => imgObj.img_file);
        }

        // ✅ Check if images is array of strings
        if (typeof property.images[0] === 'string') {
            return property.images;
        }

        // ✅ Fallback
        return ['https://cdn-icons-png.flaticon.com/512/814/814513.png'];
    };

    // ✅ CORRECTLY EXTRACT AMENITIES
    const getPropertyAmenities = () => {
        if (!property.amenities) {
            return ['No amenities listed'];
        }

        if (typeof property.amenities === 'string') {
            return property.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
        }

        if (Array.isArray(property.amenities)) {
            return property.amenities;
        }

        return ['No amenities listed'];
    };

    // ✅ CORRECTLY FORMAT PRICE
    const getFormattedPrice = () => {
        if (property.unit_price) {
            return `₹${Number(property.unit_price).toLocaleString()}`;
        }
        if (property.price) {
            return `₹${Number(property.price).toLocaleString()}`;
        }
        return 'Price not available';
    };

    // ✅ CORRECTLY FORMAT TITLE
    const getPropertyTitle = () => {
        return property.product_name || property.title || 'Property Title Not Available';
    };

    // ✅ CORRECTLY FORMAT DESCRIPTION
    const getPropertyDescription = () => {
        return property.description || 'No description available for this property.';
    };

    // ✅ Process property data
    const propertyData = {
        title: getPropertyTitle(),
        price: getFormattedPrice(),
        description: getPropertyDescription(),
        images: getPropertyImages(),
        amenities: getPropertyAmenities(),
        specifications: [
            { label: 'Type', value: property.type || 'N/A' },
            { label: 'Status', value: property.p_status || 'N/A' },
            { label: 'Budget', value: property.budget || 'N/A' },
            { label: 'Size', value: property.size ? `${property.size} sq ft` : 'N/A' },
            { label: 'Location', value: property.location || 'N/A' },
            { label: 'Entry Date', value: property.entry_date ? new Date(property.entry_date).toLocaleDateString() : 'N/A' },
            { label: 'City', value: property.city_name || 'N/A' },
            { label: 'State', value: property.state_name || 'N/A' },
        ],
        location: {
            latitude: property.latitude || 28.4595,
            longitude: property.longitude || 77.0266,
            address: property.location || 'Location not available'
        },
        owner: {
            name: 'Rajesh Kumar',
            phone: '+91 9876543210',
            email: 'rajesh.kumar@example.com'
        },
        postedDate: property.entry_date ? new Date(property.entry_date).toLocaleDateString() : 'N/A'
    };

    // Debug logging
    useEffect(() => {
        console.log('📸 Property Images:', propertyData.images);
        console.log('💰 Property Price:', propertyData.price);
        console.log('🏠 Property Title:', propertyData.title);
        console.log('📍 Property Location:', propertyData.location);
    }, []);

    // Auto scroll effect
    useEffect(() => {
        const autoScroll = () => {
            if (propertyData.images.length > 1) {
                const nextIndex = (activeImageIndex + 1) % propertyData.images.length;
                scrollToImage(nextIndex);
            }
        };

        if (propertyData.images.length > 1) {
            autoScrollRef.current = setTimeout(autoScroll, 3000);
        }

        return () => {
            if (autoScrollRef.current) {
                clearTimeout(autoScrollRef.current);
            }
        };
    }, [activeImageIndex, propertyData.images.length]);

    // Handle image scroll
    const handleImageScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setActiveImageIndex(index);

        // Auto scroll reset karein
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current);
        }

        if (propertyData.images.length > 1) {
            autoScrollRef.current = setTimeout(() => {
                const nextIndex = (index + 1) % propertyData.images.length;
                scrollToImage(nextIndex);
            }, 3000);
        }
    }

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
                            if (autoScrollRef.current) {
                                clearTimeout(autoScrollRef.current);
                            }
                        }}
                        onTouchEnd={() => {
                            if (propertyData.images.length > 1) {
                                autoScrollRef.current = setTimeout(() => {
                                    const nextIndex = (activeImageIndex + 1) % propertyData.images.length;
                                    scrollToImage(nextIndex);
                                }, 3000);
                            }
                        }}
                    >
                        {propertyData.images.map((image, index) => (
                            <View key={index} style={{ width: screenWidth, height: 300 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    resizeMode="cover"
                                    onError={(error) => {
                                        console.log('❌ Image loading error:', error.nativeEvent.error);
                                        // Fallback image set karein agar load nahi hoti
                                    }}
                                />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Image Indicators - only show if multiple images */}
                    {propertyData.images.length > 1 && (
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
                                        if (autoScrollRef.current) {
                                            clearTimeout(autoScrollRef.current);
                                        }
                                        if (propertyData.images.length > 1) {
                                            autoScrollRef.current = setTimeout(() => {
                                                const nextIndex = (index + 1) % propertyData.images.length;
                                                scrollToImage(nextIndex);
                                            }, 3000);
                                        }
                                    }}
                                />
                            ))}
                        </View>
                    )}

                    {/* Image Counter */}
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                    }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Medium',
                            color: '#fff',
                        }}>
                            {activeImageIndex + 1} / {propertyData.images.length}
                        </Text>
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