import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
    FlatList,
    ToastAndroid
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';

const AgentAddProperty = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { property } = route.params || {};

    // Property states
    const [propertyType, setPropertyType] = useState('Residential');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [budget, setBudget] = useState('');
    const [mapLocation, setMapLocation] = useState('');
    const [propertyStatus, setPropertyStatus] = useState('Available');
    const [budgetDropdownVisible, setBudgetDropdownVisible] = useState(false);

    // ✅ Media states with base64 support
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [errors, setErrors] = useState({});

    // Available amenities
    const availableAmenities = [
        'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
        'Lift', 'Power Backup', 'Water Supply', 'Park', 'Club House'
    ];

    const statusOptions = ['Available', 'Sold', 'Rented'];
    const budgetOptions = ['10L-20L', '20L-30L', '30L-40L', '40L-50L', '50L-60L', '60L-70L', '70L-80L', '80L-90L', '90L-1Cr', '1Cr+'];

    // Toggle amenity selection
    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter(item => item !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    // 👇 Prefill fields when editing
    useEffect(() => {
        if (property) {
            console.log('Edit Property Data:', property);

            // ✅ Basic Information
            setTitle(property.product_name || '');
            setDescription(property.description || '');
            setPrice(property.price || property.unit_price || '');
            setArea(property.size || '');
            setBedrooms(property.bedrooms || '');
            setBathrooms(property.bathrooms || '');

            // ✅ Property Type & Category
            setPropertyType(property.type || 'Residential');

            // ✅ Category set karna - category_id ke through
            if (property.category_id && listCategory.length > 0) {
                const category = listCategory.find(cat =>
                    cat.category_id === property.category_id ||
                    cat.id === property.category_id
                );
                setSelectedCategory(category);
            }

            // ✅ Location Details
            setLocation(property.location || '');
            setCity(property.city || property.city || '');
            setBudget(property.budget || '');
            setMapLocation(property.map || '');
            setPropertyStatus(property.p_status || 'pending');


            // ✅ Amenities - agar string mein hai toh array mein convert karein
            if (property.amenities) {
                if (typeof property.amenities === 'string') {
                    setAmenities(property.amenities.split(','));
                } else if (Array.isArray(property.amenities)) {
                    setAmenities(property.amenities);
                }
            }

            console.log('Form prefilled for editing');
        }
    }, [property, listCategory]);

    // ✅ Convert image to base64 format
    const convertImageToBase64 = async (imageUri) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Remove data:image/jpeg;base64, prefix if present
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.log('Error converting image to base64:', error);
            throw error;
        }
    };

    // ✅ Handle photo upload with base64 conversion
    const handlePhotoUpload = async () => {
        if (photos.length >= 10) {
            Alert.alert('Limit Reached', 'You can upload maximum 10 photos');
            return;
        }

        try {
            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                multiple: true,
                maxFiles: 10 - photos.length,
                cropping: true,
                compressImageQuality: 0.7, // Quality reduce karo for smaller size
                compressImageMaxWidth: 1024, // Max width limit
                compressImageMaxHeight: 1024, // Max height limit
                includeBase64: true, // ✅ Direct base64 lelo
            });

            // Handle single or multiple images
            const selectedImages = Array.isArray(image) ? image : [image];

            const newPhotos = await Promise.all(
                selectedImages.map(async (img, index) => {
                    // Agar ImagePicker se direct base64 mil raha hai toh use karo
                    let base64Data = img.data;

                    // Agar base64 nahi mila toh manually convert karo
                    if (!base64Data) {
                        base64Data = await convertImageToBase64(img.path);
                    }

                    return {
                        id: Date.now() + index,
                        uri: img.path,
                        base64: base64Data,
                        mime: img.mime || 'image/jpeg',
                        width: img.width,
                        height: img.height,
                    };
                })
            );

            setPhotos([...photos, ...newPhotos]);
            ToastAndroid.show(`${selectedImages.length} photo(s) added`, ToastAndroid.SHORT);

        } catch (error) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Failed to select photos');
                console.log('Image picker error:', error);
            }
        }
    };

    // ✅ Camera se directly photo lena with base64
    const handleTakePhoto = async () => {
        if (photos.length >= 10) {
            Alert.alert('Limit Reached', 'You can upload maximum 10 photos');
            return;
        }

        try {
            const image = await ImagePicker.openCamera({
                mediaType: 'photo',
                cropping: true,
                compressImageQuality: 0.7,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                includeBase64: true, // ✅ Direct base64
            });

            let base64Data = image.data;
            if (!base64Data) {
                base64Data = await convertImageToBase64(image.path);
            }

            const newPhoto = {
                id: Date.now(),
                uri: image.path,
                base64: base64Data,
                mime: image.mime || 'image/jpeg',
                width: image.width,
                height: image.height,
            };

            setPhotos([...photos, newPhoto]);
            ToastAndroid.show('Photo taken successfully', ToastAndroid.SHORT);

        } catch (error) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Failed to take photo');
                console.log('Camera error:', error);
            }
        }
    };

    // ✅ Handle video upload (base64 format mein)
    const handleVideoUpload = async () => {
        if (videos.length >= 3) {
            Alert.alert('Limit Reached', 'You can upload maximum 3 videos');
            return;
        }

        try {
            const video = await ImagePicker.openPicker({
                mediaType: 'video',
                multiple: false,
                compressVideoPreset: 'MediumQuality',
            });

            // Video ko base64 mein convert karo
            const videoBase64 = await convertImageToBase64(video.path);

            const newVideo = {
                id: Date.now(),
                uri: video.path,
                base64: videoBase64,
                duration: video.duration,
                size: video.size,
                mime: video.mime || 'video/mp4',
            };

            setVideos([...videos, newVideo]);
            ToastAndroid.show('Video added successfully', ToastAndroid.SHORT);

        } catch (error) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Failed to select video');
                console.log('Video picker error:', error);
            }
        }
    };

    // ✅ Remove media item
    const removeMedia = (id, type) => {
        if (type === 'photo') {
            const updatedPhotos = photos.filter(photo => photo.id !== id);
            setPhotos(updatedPhotos);
            ToastAndroid.show('Photo removed', ToastAndroid.SHORT);
        } else {
            const updatedVideos = videos.filter(video => video.id !== id);
            setVideos(updatedVideos);
            ToastAndroid.show('Video removed', ToastAndroid.SHORT);
        }
    };

    // ✅ Reset Form Function
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setArea('');
        setBedrooms('');
        setBathrooms('');
        setPropertyType('Residential');
        setSelectedCategory(null);
        setLocation('');
        setCity('');
        setBudget('');
        setMapLocation('');
        setPropertyStatus('pending');
        setAmenities([]);
        setPhotos([]);
        setVideos([]);
        setDropdownVisible(false);
        setBudgetDropdownVisible(false);
        console.log('Form reset successfully');
    };

    // ✅ Validate Form
    const validateForm = () => {
        let tempErrors = {};

        if (!selectedCategory) tempErrors.category = 'Please select category';
        if (!title.trim()) tempErrors.title = 'Please enter property title';
        if (!price.trim()) tempErrors.price = 'Please enter property price';
        if (!location.trim()) tempErrors.location = 'Please enter property location';
        if (!city.trim()) tempErrors.city = 'Please enter city';
        if (photos.length === 0) tempErrors.photos = 'Please add at least one photo';

        setErrors(tempErrors);

        // agar koi error hai to false return kar
        return Object.keys(tempErrors).length === 0;
    };


    // ✅ Main Submit Function with Base64 Array
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setUploading(true);

        try {
            // ✅ Prepare photos array in base64 format
            const photosBase64Array = photos.map(photo =>
                `data:${photo.mime};base64,${photo.base64}`
            );

            // ✅ Prepare videos array in base64 format
            const videosBase64Array = videos.map(video =>
                `data:${video.mime};base64,${video.base64}`
            );

            // ✅ Prepare JSON data
            const propertyData = {
                // ✅ Edit mode mein p_id add karein
                ...(property && { p_id: property.p_id }),
                category_id: selectedCategory.category_id,
                product_name: title,
                description: description,
                type: propertyType,
                price: price,
                city: city,
                location: location,
                amenities: amenities.join(','),
                budget: budget,
                size: area,
                map: mapLocation,
                p_status: propertyStatus,
                p_image: photosBase64Array, // ✅ Base64 array
                p_video: videosBase64Array  // ✅ Base64 array
            };

            console.log('📤 Sending Property Data with Images:', {
                ...propertyData,
                p_image: `${photosBase64Array.length} images`,
                p_video: `${videosBase64Array.length} videos`
            });

            const endpoint = property
                ? `${ApiConstant.URL}${ApiConstant.OtherURL.update_property}`
                : `${ApiConstant.URL}${ApiConstant.OtherURL.add_property}`;

            // ✅ API Call for JSON
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData),
            });

            const result = await response.json();
            console.log('📥 API Response:', result);

            if (result.code === 200) {
                const successMessage = property
                    ? 'Property updated successfully!'
                    : 'Property added successfully!';

                ToastAndroid.show(successMessage, ToastAndroid.LONG);

                if (!property) {
                    resetForm();
                }

                navigation.goBack();
            } else {
                ToastAndroid.show(result.message || 'Failed to save property', ToastAndroid.LONG);
            }

        } catch (error) {
            console.log('❌ Error adding property:', error);
            ToastAndroid.show('Network error occurred', ToastAndroid.LONG);
        } finally {
            setUploading(false);
        }
    };

    // Category API Call
    const ListCategoryApi = async () => {
        try {
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.code == 200 && result.payload) {
                setListCategory(result.payload);
            } else {
                console.log('❌ Error: Failed to load categories');
            }
        } catch (error) {
            console.log('❌ Error fetching categories:', error.message);
        }
    };

    useEffect(() => {
        ListCategoryApi();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <Header
                    title={property ? "Edit Property" : "Add Property"}
                    onBackPress={() => navigation.goBack()}
                />

                <View style={{ padding: 20 }}>
                    {/* ✅ Category Dropdown */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Category *
                    </Text>

                    <View style={{ position: 'relative', marginBottom: 20 }}>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#f9f9f9',
                                paddingHorizontal: 15,
                                paddingVertical: 12,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                zIndex: 10,
                            }}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: selectedCategory ? colors.TextColorBlack : colors.PlaceHolderTextcolor,
                            }}>
                                {selectedCategory ? selectedCategory.category_name : 'Select Category'}
                            </Text>
                            <Ionicons
                                name={dropdownVisible ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {dropdownVisible && (
                            <View style={{
                                position: 'absolute',
                                top: 55,
                                left: 0,
                                right: 0,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#fff',
                                maxHeight: 200,
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                zIndex: 1000,
                            }}>
                                <FlatList
                                    data={listCategory}
                                    keyExtractor={(item) => item.category_id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 15,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#f0f0f0',
                                                backgroundColor: selectedCategory?.category_id === item.category_id ? '#f0f8ff' : '#fff',
                                            }}
                                            onPress={() => {
                                                setSelectedCategory(item);
                                                setDropdownVisible(false);
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: 16,
                                                fontFamily: 'Inter-Medium',
                                                color: colors.TextColorBlack,
                                            }}>
                                                {item.category_name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                    </View>

                    {/* Rest of your existing UI components remain same */}
                    {/* Property Type Selection */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Property Type *
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#007AFF',
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginBottom: 20,
                    }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyType === 'Residential' ? '#007AFF' : '#fff',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyType('Residential')}>
                            <Text style={{
                                color: propertyType === 'Residential' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Residential
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyType === 'Commercial' ? '#007AFF' : '#fff',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyType('Commercial')}>
                            <Text style={{
                                color: propertyType === 'Commercial' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Commercial
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyType === 'Rent' ? '#007AFF' : '#fff',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyType('Rent')}>
                            <Text style={{
                                color: propertyType === 'Rent' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Rent
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyType === 'Buy' ? '#007AFF' : '#fff',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyType('Buy')}>
                            <Text style={{
                                color: propertyType === 'Buy' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Buy
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Basic Information Section */}
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Basic Information
                    </Text>

                    {/* Title */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: errors.title ? 'red' : '#ccc',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 15,
                    }}>
                        <TextInput
                            style={{
                                paddingVertical: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Property Title *"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={title}
                            onChangeText={(text) => {
                                setTitle(text);
                                setErrors(prev => ({ ...prev, title: '' })); // remove error on typing
                            }}
                        />
                        {errors.title && <Text style={{ color: 'red', fontSize: 12 }}>{errors.title}</Text>}
                    </View>

                    {/* Description */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 15,
                        height: 100,
                    }}>
                        <TextInput
                            style={{
                                paddingVertical: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                textAlignVertical: 'top',
                            }}
                            placeholder="Property Description"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Price and Area Row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            width: '48%',
                        }}>
                            <TextInput
                                style={{
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                }}
                                placeholder="Price *"
                                placeholderTextColor={colors.PlaceHolderTextcolor}
                                value={price}
                                onChangeText={(text) => {
                                    setPrice(text);
                                    setErrors(prev => ({ ...prev, price: '' })); // remove error on typing
                                }}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            width: '48%',
                        }}>
                            <TextInput
                                style={{
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                }}
                                placeholder="Area (sq ft)"
                                placeholderTextColor={colors.PlaceHolderTextcolor}
                                value={area}
                                onChangeText={setArea}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* ✅ Budget Dropdown */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Budget Range
                    </Text>
                    <View style={{ position: 'relative', marginBottom: 15 }}>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#f9f9f9',
                                paddingHorizontal: 15,
                                paddingVertical: 12,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                zIndex: 10,
                            }}
                            onPress={() => setBudgetDropdownVisible(!budgetDropdownVisible)}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: budget ? colors.TextColorBlack : colors.PlaceHolderTextcolor,
                            }}>
                                {budget || 'Select Budget Range'}
                            </Text>
                            <Ionicons
                                name={budgetDropdownVisible ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {budgetDropdownVisible && (
                            <View style={{
                                position: 'absolute',
                                top: 55,
                                left: 0,
                                right: 0,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#fff',
                                maxHeight: 200,
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                zIndex: 1000,
                            }}>
                                <FlatList
                                    nestedScrollEnabled={true}
                                    data={budgetOptions}
                                    keyExtractor={(item) => item}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 15,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#f0f0f0',
                                                backgroundColor: budget === item ? '#f0f8ff' : '#fff',
                                            }}
                                            onPress={() => {
                                                setBudget(item);
                                                setBudgetDropdownVisible(false);
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: 16,
                                                fontFamily: 'Inter-Medium',
                                                color: colors.TextColorBlack,
                                            }}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                    </View>

                    {/* ✅ Property Status */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Property Status
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#007AFF',
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginBottom: 20,
                    }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyStatus === 'Available' ? '#007AFF' : '#fff',
                                width: '33.33%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyStatus('Available')}
                        >
                            <Text style={{
                                color: propertyStatus === 'Available' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Available
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyStatus === 'Rented' ? '#007AFF' : '#fff',
                                width: '33.33%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyStatus('Rented')}
                        >
                            <Text style={{
                                color: propertyStatus === 'Rented' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Rented
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                backgroundColor: propertyStatus === 'sold' ? '#007AFF' : '#fff',
                                width: '33.33%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setPropertyStatus('sold')}
                        >
                            <Text style={{
                                color: propertyStatus === 'sold' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold',
                                fontSize: 12
                            }}>
                                Sold
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Details */}
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Location Details
                    </Text>

                    <View style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 15,
                    }}>
                        <TextInput
                            style={{
                                paddingVertical: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Full Address *"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={location}
                            multiline={true}
                            onChangeText={(text) => {
                                setLocation(text);
                                setErrors(prev => ({ ...prev, location: '' })); // remove error on typing
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            width: '100%',
                        }}>
                            <TextInput
                                style={{
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                }}
                                placeholder="City *"
                                placeholderTextColor={colors.PlaceHolderTextcolor}
                                value={city}
                                onChangeText={(text) => {
                                    setCity(text);
                                    setErrors(prev => ({ ...prev, city: '' })); // remove error on typing
                                }}
                            />
                        </View>
                    </View>

                    {/* Amenities */}
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Amenities
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                    }}>
                        {availableAmenities.map((amenity, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    backgroundColor: amenities.includes(amenity) ? colors.AppColor : '#f9f9f9',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: amenities.includes(amenity) ? colors.AppColor : '#ddd',
                                    marginBottom: 10,
                                    width: '48%',
                                }}
                                onPress={() => toggleAmenity(amenity)}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: 'Inter-Medium',
                                    color: amenities.includes(amenity) ? '#fff' : colors.TextColorBlack,
                                    textAlign: 'center',
                                }}>
                                    {amenity}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ✅ Media Upload Section */}
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Media Upload
                    </Text>

                    {/* Photos */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Photos ({photos.length}/10)
                    </Text>

                    {/* ✅ Photo Upload Options */}
                    <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: colors.AppColor,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                            onPress={handlePhotoUpload}
                        >
                            <Ionicons name="images-outline" size={20} color="#fff" />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#fff',
                                marginLeft: 8,
                            }}>
                                Gallery
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#4CAF50',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                            onPress={handleTakePhoto}
                        >
                            <Ionicons name="camera-outline" size={20} color="#fff" />
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: '#fff',
                                marginLeft: 8,
                            }}>
                                Camera
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Photos Preview */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                        {photos.map((photo) => (
                            <View key={photo.id} style={{ position: 'relative', marginRight: 10 }}>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 8,
                                    }}
                                />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        borderRadius: 12,
                                        width: 24,
                                        height: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => removeMedia(photo.id, 'photo')}
                                >
                                    <Ionicons name="close" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Videos */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Videos ({videos.length}/3)
                    </Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FF9800',
                            paddingVertical: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginBottom: 15,
                        }}
                        onPress={handleVideoUpload}
                    >
                        <Ionicons name="videocam-outline" size={20} color="#fff" />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: '#fff',
                            marginLeft: 8,
                        }}>
                            Select Video
                        </Text>
                    </TouchableOpacity>

                    {/* Videos Preview */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30 }}>
                        {videos.map((video) => (
                            <View key={video.id} style={{ position: 'relative', marginRight: 10 }}>
                                <View style={{
                                    width: 120,
                                    height: 120,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Ionicons name="play-circle" size={40} color="#888" />
                                    <Text style={{
                                        fontSize: 10,
                                        fontFamily: 'Inter-Regular',
                                        color: '#666',
                                        marginTop: 5,
                                        textAlign: 'center',
                                    }}>
                                        {Math.round(video.duration / 1000)}s
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        borderRadius: 12,
                                        width: 24,
                                        height: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => removeMedia(video.id, 'video')}
                                >
                                    <Ionicons name="close" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Submit Button */}
                    <CustomButton
                        title={uploading ? "Uploading..." : (property ? "Update Property" : "Add Property")}
                        onPress={handleSubmit}
                        variant="primary"
                        size="large"
                        disabled={uploading}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AgentAddProperty;