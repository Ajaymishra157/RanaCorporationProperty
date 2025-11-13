import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    Linking,
    ToastAndroid,
    ActivityIndicator,
    Alert,
    Modal
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import colors from '../constants/Colors';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth } = Dimensions.get('window');

const PropertyDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { property } = route.params;
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [propertyCoordinates, setPropertyCoordinates] = useState(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [checkingWishlist, setCheckingWishlist] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Add these states with your existing useState declarations
    const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [visitName, setVisitName] = useState('');
    const [visitPhone, setVisitPhone] = useState('');
    const [visitEmail, setVisitEmail] = useState('');
    const [visitNotes, setVisitNotes] = useState('');
    const [scheduleLoading, setScheduleLoading] = useState(false);

    // Add these states with your existing useState declarations
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        date: '',
        time: ''
    });


    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(value.replace(/\D/g, ''))) return 'Enter valid phone number';
                return '';

            case 'date':
                if (!value) return 'Date is required';
                if (value < new Date().setHours(0, 0, 0, 0)) return 'Date cannot be in past';
                return '';

            case 'time':
                if (!value) return 'Time is required';
                return '';

            default:
                return '';
        }
    };


    const validateForm = () => {
        const newErrors = {
            name: validateField('name', visitName),
            phone: validateField('phone', visitPhone),
            date: validateField('date', selectedDate),
            time: validateField('time', selectedTime)
        };

        setErrors(newErrors);


        return !Object.values(newErrors).some(error => error !== '');
    };


    // Add these functions after your existing functions (toggleWishlist, etc.)
    const handleScheduleVisit = () => {
        setIsVisitModalVisible(true);
    };

    // AppSetting jaisa exact handlers

    const handleDateChange = (event, date) => {

        if (event.type == 'set' && date) {
            setSelectedDate(date);

        }
        setShowDatePicker(false); // close picker safely after handling
    };

    const handleTimeChange = (event, time) => {
        if (event.type === 'set' && time) {
            setSelectedTime(time);
            setErrors(prev => ({ ...prev, time: validateField('time', time) }));
        }
        setShowTimePicker(false); // close picker safely after handling
    };


    // Format functions - AppSetting jaisa
    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {
        let hours = time.getHours();
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        return `${hours}:${minutes} ${ampm}`;
    };

    // Get current date/time for picker - AppSetting jaisa
    const getDateForPicker = (date) => {
        return date || new Date();
    };

    const getTimeForPicker = (timeString) => {
        if (!timeString) return new Date();

        const time = new Date(timeString);
        return isNaN(time.getTime()) ? new Date() : time;
    };

    const handleSubmitVisit = async () => {
        // Validate form first
        if (!validateForm()) {
            ToastAndroid.show('Please fix all errors', ToastAndroid.SHORT);
            return;
        }

        setScheduleLoading(true);

        try {
            const customer_id = await AsyncStorage.getItem('id');

            const visitData = {
                customer_id: customer_id,
                property_id: property.p_id,
                visit_date: formatDate(selectedDate),
                visit_time: formatTime(selectedTime),
                name: visitName,
                phone: visitPhone,
                email: visitEmail,
                notes: visitNotes,
                property_title: propertyData.title,
                property_price: propertyData.price
            };

            console.log('Scheduling visit:', visitData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            ToastAndroid.show('Visit scheduled successfully!', ToastAndroid.SHORT);
            setIsVisitModalVisible(false);
            resetVisitForm();

        } catch (error) {
            console.log('Error scheduling visit:', error);
            ToastAndroid.show('Failed to schedule visit', ToastAndroid.SHORT);
        } finally {
            setScheduleLoading(false);
        }
    };

    const resetVisitForm = () => {
        setVisitName('');
        setVisitPhone('');
        setVisitEmail('');
        setVisitNotes('');
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        setErrors({
            name: '',
            phone: '',
            date: '',
            time: ''
        });

    };

    const scrollViewRef = useRef();
    const autoScrollRef = useRef();

    const logPropertyView = async () => {
        try {

            const customer_id = await AsyncStorage.getItem('id');
            const user_type = await AsyncStorage.getItem('user_type');

            // Agar user logged in nahi hai, to log nahi karenge
            if (!customer_id) {
                console.log('User not logged in, skipping view log');
                return;
            }

            const payload = {
                user_type: user_type,
                user_id: customer_id,
                property_id: property.p_id
            };

            console.log('Logging property view:', payload);

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.add_view_property}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.code === 200) {
                console.log('✅ Property view logged successfully');
            } else {
                console.log('❌ Failed to log property view:', result.message);
            }
        } catch (error) {
            console.log('❌ Error logging property view:', error);
        } finally {

        }
    };

    // ✅ Component mount hone par view log karo
    useEffect(() => {
        logPropertyView();
    }, []);


    // ✅ Address se coordinates nikalne ka function
    const getCoordinatesFromAddress = async (address) => {
        try {
            if (!address) return null;

            const apiKey = 'AIzaSyBvoWcgSBGvofFvJi2tPnOyr7mj7Plc1pk';
            const encodedAddress = encodeURIComponent(address);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng
                };
            }
            return null;
        } catch (error) {
            console.log('Geocoding error:', error);
            return null;
        }
    };

    useEffect(() => {
        checkWishlistStatus();
    }, [property.property_id]);

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

    // ✅ Coordinates fetch karo
    useEffect(() => {
        fetchCoordinates();
    }, [property.location]);

    const fetchCoordinates = async () => {
        try {
            setMapLoading(true);

            // Sirf address use karke coordinates nikalna hai
            if (property.location) {
                const coords = await getCoordinatesFromAddress(property.location);
                if (coords) {
                    setPropertyCoordinates(coords);
                }
            }
        } catch (error) {
            console.log('Error fetching coordinates:', error);
        } finally {
            setMapLoading(false);
        }
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
            latitude: property.latitude || 20.1218,
            longitude: property.longitude || 84.1236,
            address: property.location || 'Location not available'
        },
        owner: {
            name: property.user_name || '---',
            phone: property.whatsapp_number || '---',

        },
        postedDate: property.entry_date ? new Date(property.entry_date).toLocaleDateString() : 'N/A'
    };



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



    const checkWishlistStatus = async () => {
        try {
            setCheckingWishlist(true);
            const customer_id = await AsyncStorage.getItem('id');




            if (!customer_id || !property.p_id) {
                setIsInWishlist(false);
                return;
            }

            const url = `${ApiConstant.URL}${ApiConstant.OtherURL.check_wishlist}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: customer_id,
                    p_id: property.p_id
                }),
            });

            const result = await response.json();
            console.log("Wishlist check response:", result);

            // ✅ Updated logic based on your API response
            if (result.code === 200) {
                // result.wishlist true/fata hai
                setIsInWishlist(result.wishlist || false);
            } else {
                setIsInWishlist(false);
            }
        } catch (error) {
            console.log('Error checking wishlist:', error);
            setIsInWishlist(false);
        } finally {
            setCheckingWishlist(false);
        }
    };


    const addToWishlist = async () => {
        try {
            setWishlistLoading(true);
            const customer_id = await AsyncStorage.getItem('id');


            if (!customer_id) {
                console.log('Please login to add properties to wishlist');
                return;
            }

            const url = `${ApiConstant.URL}${ApiConstant.OtherURL.add_wishlist}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: customer_id,
                    property_id: property.p_id
                }),
            });

            const result = await response.json();

            if (result.code == 200) {

                setIsInWishlist(true);

                ToastAndroid.show("Property added to wishlist!", ToastAndroid.SHORT);
            } else {
                console.log(result.message || 'Failed to add to wishlist');
            }
        } catch (error) {
            console.log('Add to wishlist error:', error);
            console.log("Network request failed");
        } finally {
            setWishlistLoading(false);
        }
    };

    const removeFromWishlist = async () => {
        try {
            setWishlistLoading(true);
            const customer_id = await AsyncStorage.getItem('id');





            const url = `${ApiConstant.URL}${ApiConstant.OtherURL.delete_wishlist}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: customer_id,
                    p_id: property.p_id
                }),
            });

            const result = await response.json();
            console.log("Remove wishlist response:", result);

            if (result.code == 200) {
                setIsInWishlist(false);

                ToastAndroid.show("Property removed from wishlist", ToastAndroid.SHORT);
            } else {
                Alert.alert('Error', result.message || 'Failed to remove from wishlist');
            }
        } catch (error) {
            console.log('Remove from wishlist error:', error);
            Alert.alert('Error', 'Network request failed');
        } finally {
            setWishlistLoading(false);
        }
    };


    // ✅ TOGGLE WISHLIST
    const toggleWishlist = () => {
        if (wishlistLoading) return;

        if (isInWishlist) {
            removeFromWishlist();
        } else {
            addToWishlist();
        }
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
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={toggleWishlist}
                        disabled={wishlistLoading || checkingWishlist}
                    >
                        {wishlistLoading || checkingWishlist ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons
                                name={isInWishlist ? "heart" : "heart-outline"}
                                size={20}
                                color={isInWishlist ? "#ff4757" : "#fff"}
                            />
                        )}
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

                    {mapLoading ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: 8
                        }}>
                            <ActivityIndicator size="large" color={colors.AppColor} />
                            <Text style={{ marginTop: 10, color: '#666' }}>Loading map...</Text>
                        </View>
                    ) : propertyCoordinates ? (
                        <MapView
                            style={{ flex: 1, borderRadius: 8 }}
                            initialRegion={{
                                latitude: propertyCoordinates.latitude,
                                longitude: propertyCoordinates.longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: propertyCoordinates.latitude,
                                    longitude: propertyCoordinates.longitude,
                                }}
                                title={property.product_name}
                                description={property.location}
                            />
                        </MapView>
                    ) : (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: 8
                        }}>
                            <Text style={{ color: '#666' }}>Location not available</Text>
                        </View>
                    )}
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
                                backgroundColor: !propertyData.owner.phone || propertyData.owner.phone === '---' ? '#CCCCCC' : '#4CAF50',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginRight: 8,
                                opacity: !propertyData.owner.phone || propertyData.owner.phone === '---' ? 0.6 : 1,
                            }}
                            onPress={(!propertyData.owner.phone || propertyData.owner.phone === '---') ? null : handleCallOwner}
                            disabled={!propertyData.owner.phone || propertyData.owner.phone === '---'}
                        >
                            <Ionicons name="call" size={18} color={(!propertyData.owner.phone || propertyData.owner.phone === '---') ? '#666' : '#fff'} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: (!propertyData.owner.phone || propertyData.owner.phone === '---') ? '#666' : '#fff',
                                marginLeft: 8,
                            }}>
                                {(!propertyData.owner.phone || propertyData.owner.phone === '---') ? 'No Number' : 'Call'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: !propertyData.owner.phone || propertyData.owner.phone === '---' ? '#CCCCCC' : '#25D366',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginLeft: 8,
                                opacity: !propertyData.owner.phone || propertyData.owner.phone === '---' ? 0.6 : 1,
                            }}
                            onPress={(!propertyData.owner.phone || propertyData.owner.phone === '---') ? null : handleMessageOwner}
                            disabled={!propertyData.owner.phone || propertyData.owner.phone === '---'}
                        >
                            <Ionicons name="logo-whatsapp" size={18} color={(!propertyData.owner.phone || propertyData.owner.phone === '---') ? '#666' : '#fff'} />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: (!propertyData.owner.phone || propertyData.owner.phone === '---') ? '#666' : '#fff',
                                marginLeft: 8,
                            }}>
                                {(!propertyData.owner.phone || propertyData.owner.phone === '---') ? 'Not Available' : 'WhatsApp'}
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

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Enquiry Now with Message Icon */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.AppColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                        onPress={() => navigation.navigate('CustomerEnquiry')}
                    >
                        <Ionicons name="chatbubble-outline" size={16} color={colors.AppColor} />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.AppColor,
                        }}>
                            Enquiry
                        </Text>
                    </TouchableOpacity>

                    {/* Schedule Visit with Calendar Icon */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.AppColor,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                        onPress={handleScheduleVisit}
                    >
                        <Ionicons name="calendar-outline" size={16} color="#fff" />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Bold',
                            color: '#fff',
                        }}>
                            Visit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisitModalVisible}
                onRequestClose={() => setIsVisitModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        maxHeight: '80%'
                    }}>
                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                            paddingBottom: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                            }}>
                                Schedule a Visit
                            </Text>
                            <TouchableOpacity onPress={() => setIsVisitModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Property Info */}
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                padding: 15,
                                borderRadius: 12,
                                marginBottom: 20,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    color: colors.TextColorBlack,
                                    marginBottom: 5,
                                }}>
                                    {propertyData.title}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.AppColor,
                                }}>
                                    {propertyData.price}
                                </Text>
                            </View>

                            {/* Date and Time Selection */}

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    color: colors.TextColorBlack,
                                    marginBottom: 15,
                                }}>
                                    Select Date & Time
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {/* Date Picker - AppSetting jaisa */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Regular',
                                            color: '#666',
                                            marginBottom: 4,
                                        }}>
                                            Date *
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                borderWidth: 1,
                                                borderColor: errors.date ? '#ff4757' : '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                backgroundColor: '#fff',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                fontFamily: 'Inter-Medium',
                                                color: colors.TextColorBlack,
                                            }}>
                                                {formatDate(selectedDate)}
                                            </Text>
                                            <Ionicons name="calendar-outline" size={20} color={colors.TextColorBlack} />
                                        </TouchableOpacity>
                                        {errors.date ? (
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#ff4757',
                                                marginTop: 4,
                                                fontFamily: 'Inter-Regular'
                                            }}>
                                                {errors.date}
                                            </Text>
                                        ) : null}
                                    </View>

                                    {/* Time Picker - AppSetting jaisa */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Regular',
                                            color: '#666',
                                            marginBottom: 4,
                                        }}>
                                            Time *
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                borderWidth: 1,
                                                borderColor: errors.time ? '#ff4757' : '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                backgroundColor: '#fff',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => setShowTimePicker(true)}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                fontFamily: 'Inter-Medium',
                                                color: colors.TextColorBlack,
                                            }}>
                                                {formatTime(selectedTime)}
                                            </Text>
                                            <Ionicons name="time-outline" size={20} color={colors.TextColorBlack} />
                                        </TouchableOpacity>
                                        {errors.time ? (
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#ff4757',
                                                marginTop: 4,
                                                fontFamily: 'Inter-Regular'
                                            }}>
                                                {errors.time}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                {/* Date Time Pickers - AppSetting jaisa display="spinner" use karo */}
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="date"
                                        display="calendar" // "spinner" ki jagah "calendar" try karo
                                        minimumDate={new Date()}
                                        onChange={handleDateChange}
                                    />
                                )}

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={selectedTime}
                                        mode="time"
                                        display="spinner" // Ya "clock" try karo
                                        onChange={handleTimeChange}
                                    />
                                )}
                            </View>

                            {/* Contact Information */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    color: colors.TextColorBlack,
                                    marginBottom: 15,
                                }}>
                                    Your Information
                                </Text>

                                <View style={{ gap: 15 }}>
                                    {/* Name */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: colors.TextColorBlack,
                                            marginBottom: 8,
                                        }}>
                                            Full Name *
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: errors.name ? '#ff4757' : '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                fontSize: 14,
                                                fontFamily: 'Inter-Regular',
                                                backgroundColor: '#fff'
                                            }}
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#999"
                                            value={visitName}
                                            onChangeText={(text) => {
                                                setVisitName(text);
                                                // Real-time validation
                                                setErrors(prev => ({ ...prev, name: validateField('name', text) }));
                                            }}
                                        />
                                        {errors.name ? (
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#ff4757',
                                                marginTop: 4,
                                                fontFamily: 'Inter-Regular'
                                            }}>
                                                {errors.name}
                                            </Text>
                                        ) : null}
                                    </View>

                                    {/* Phone */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: colors.TextColorBlack,
                                            marginBottom: 8,
                                        }}>
                                            Phone Number *
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: errors.phone ? '#ff4757' : '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                fontSize: 14,
                                                fontFamily: 'Inter-Regular',
                                                backgroundColor: '#fff'
                                            }}
                                            placeholder="Enter your phone number"
                                            placeholderTextColor="#999"
                                            value={visitPhone}
                                            onChangeText={(text) => {
                                                setVisitPhone(text);
                                                // Real-time validation
                                                setErrors(prev => ({ ...prev, phone: validateField('phone', text) }));
                                            }}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                        />
                                        {errors.phone ? (
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#ff4757',
                                                marginTop: 4,
                                                fontFamily: 'Inter-Regular'
                                            }}>
                                                {errors.phone}
                                            </Text>
                                        ) : null}
                                    </View>

                                    {/* Email */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: colors.TextColorBlack,
                                            marginBottom: 8,
                                        }}>
                                            Email Address
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                fontSize: 14,
                                                fontFamily: 'Inter-Regular',
                                                backgroundColor: '#fff'
                                            }}
                                            placeholder="Enter your email address"
                                            placeholderTextColor="#999"
                                            value={visitEmail}
                                            onChangeText={setVisitEmail}
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    {/* Notes */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: colors.TextColorBlack,
                                            marginBottom: 8,
                                        }}>
                                            Additional Notes
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#e0e0e0',
                                                borderRadius: 8,
                                                padding: 15,
                                                fontSize: 14,
                                                fontFamily: 'Inter-Regular',
                                                backgroundColor: '#fff',
                                                height: 80,
                                                textAlignVertical: 'top'
                                            }}
                                            placeholder="Any specific requirements or questions..."
                                            placeholderTextColor="#999"
                                            value={visitNotes}
                                            onChangeText={setVisitNotes}
                                            multiline
                                            numberOfLines={3}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.AppColor,
                                    paddingVertical: 15,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginBottom: 10,
                                    opacity: scheduleLoading ? 0.7 : 1
                                }}
                                onPress={handleSubmitVisit}
                                disabled={scheduleLoading}
                            >
                                {scheduleLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Bold',
                                        color: '#fff',
                                    }}>
                                        Schedule Visit
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default PropertyDetail;