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
    ToastAndroid,
    TouchableWithoutFeedback,
    PermissionsAndroid,
    Platform,
    Linking,
    ActivityIndicator,
    Modal,
    Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import ConfirmationModal from '../components/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bottomtab from '../components/Bottomtab';
import { Dropdown } from 'react-native-element-dropdown';

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

    // ✅ New states for state and city dropdowns
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
    const [stateSearch, setStateSearch] = useState('');

    const [cityDropdownVisible, setCityDropdownVisible] = useState(false);
    const [citySearch, setCitySearch] = useState('');

    const [loadingCities, setLoadingCities] = useState(false);

    const [amenities, setAmenities] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [budget, setBudget] = useState('');
    const [mapLocation, setMapLocation] = useState('');
    const [propertyStatus, setPropertyStatus] = useState('Available');
    const [budgetDropdownVisible, setBudgetDropdownVisible] = useState(false);

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);


    // ✅ Media states with base64 support
    const [photos, setPhotos] = useState([]);
    // const [videos, setVideos] = useState([]);
    const [videoLink, setVideoLink] = useState('');
    const [uploading, setUploading] = useState(false);

    const [errors, setErrors] = useState({});

    // // ✅ NEW: Agent details states
    // const [agentName, setAgentName] = useState('');
    // const [agentMobile, setAgentMobile] = useState('');

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

    // 👇 Prefill fields when editing - COMPLETELY UPDATE THIS
    useEffect(() => {
        if (property) {
            console.log('Edit Property Data:', property);

            // ✅ Basic Information
            setTitle(property.product_name || '');
            setDescription(property.description || '');
            setPrice(property.unit_price || property.price || '');
            setArea(property.size || '');
            setBedrooms(property.bedrooms || '');
            setBathrooms(property.bathrooms || '');

            // ✅ NEW: Agent details prefilling
            // setAgentName(property.agent_name || '');
            // setAgentMobile(property.agent_mobile || '');

            // ✅ Property Type & Category
            setPropertyType(property.type || 'Residential');

            // ✅ Category set karna
            if (property.category_id && listCategory.length > 0) {
                const category = listCategory.find(cat =>
                    cat.category_id == property.category_id
                );
                setSelectedCategory(category);
            }

            // ✅ Location Details
            setLocation(property.location || '');
            setCity(property.city_name || ''); // ✅ city_name use karo
            setBudget(property.budget || '');
            setMapLocation(property.map || '');
            setPropertyStatus(property.p_status || 'Available');

            // ✅ Video Link - videos array se first video
            setVideoLink(property.video && property.video.length > 0 ? property.video : '');

            // ✅ AMENITIES PREFILL - IMPORTANT
            if (property.amenities) {
                if (typeof property.amenities === 'string') {
                    // "Pool,Gym,Parking" format se array mein convert karo
                    const amenitiesArray = property.amenities.split(',').map(item => item.trim());
                    setAmenities(amenitiesArray);
                    console.log('Amenities prefilled:', amenitiesArray);
                } else if (Array.isArray(property.amenities)) {
                    setAmenities(property.amenities);
                }
            }

            console.log('Form prefilled for editing:', property);
        }
    }, [property, listCategory]);

    // ✅ STATES LOAD HONE KE BAAD STATE PREFILL
    useEffect(() => {
        if (property && property.state && states.length > 0) {
            // State ID match karo (number vs string compare)
            const stateObj = states.find(s =>
                s.id == property.state ||
                s.id == property.state
            );
            if (stateObj) {
                setSelectedState(stateObj);
                console.log('State prefilled:', stateObj);
            }
        }
    }, [property, states]);

    // ✅ CITIES LOAD HONE KE BAAD CITY PREFILL  
    useEffect(() => {
        if (property && property.city && cities.length > 0 && selectedState) {
            // City ID match karo
            const cityObj = cities.find(c =>
                c.id == property.city ||
                c.id == property.city
            );
            if (cityObj) {
                setSelectedCity(cityObj);
                console.log('City prefilled:', cityObj);
            }
        }
    }, [property, cities, selectedState]);

    // ✅ IMAGES PREFILL
    // ✅ IMAGES PREFILL - CORRECTED VERSION
    useEffect(() => {
        if (property && property.images && property.images.length > 0) {
            console.log('📸 Raw images data:', property.images);

            const preloadedPhotos = property.images.map((imgObj, index) => {
                // ✅ Correctly extract image URL from the object
                const imageUrl = imgObj.img_file || imgObj.url || imgObj.uri || imgObj;
                console.log(`📸 Image ${index}:`, imageUrl);

                return {
                    id: `existing_${imgObj.img_id || index}_${Date.now()}`,
                    uri: imageUrl,
                    base64: '', // Existing images ke liye base64 empty
                    mime: 'image/jpeg',
                    width: 400,
                    height: 300,
                    isExisting: true, // Flag for existing images
                    img_id: imgObj.img_id // Store image ID for reference
                };
            });

            setPhotos(preloadedPhotos);
            console.log('✅ Images prefilled:', preloadedPhotos.length);
            console.log('✅ Prefilled photos details:', preloadedPhotos);
        }
    }, [property]);


    // ✅ Fetch States API
    const fetchStates = async () => {
        try {
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_state}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.code === 200 && result.payload) {
                setStates(result.payload);
            } else {
                console.log('❌ Error fetching states:', result.message);
                ToastAndroid.show('Failed to load states', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('❌ Error fetching states:', error.message);
            ToastAndroid.show('Network error loading states', ToastAndroid.SHORT);
        }
    };

    // ✅ Fetch Cities API based on state ID
    const fetchCities = async (stateId) => {
        if (!stateId) return;

        setLoadingCities(true);
        try {
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_cities}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state_id: stateId
                })
            });

            const result = await response.json();

            if (result.code === 200 && result.payload) {
                setCities(result.payload);
            } else {
                console.log('❌ Error fetching cities:', result.message);
                ToastAndroid.show('Failed to load cities', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('❌ Error fetching cities:', error.message);
            ToastAndroid.show('Network error loading cities', ToastAndroid.SHORT);
        } finally {
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        ListCategoryApi();
        fetchStates(); // ✅ Load states on component mount
    }, []);

    // ✅ When state is selected, fetch its cities
    useEffect(() => {
        if (selectedState) {
            fetchCities(selectedState.id || selectedState.id);
        }
    }, [selectedState]);

    const checkGalleryPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                // Android 13+ (API 33+) ke liye
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: 'Storage Permission Required',
                            message: 'This app needs access to your gallery to select photos',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    // Android 12 aur niche ke liye
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Permission Required',
                            message: 'This app needs access to your gallery to select photos',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            } catch (error) {
                console.log('Permission error:', error);
                return false;
            }
        }
        return true; // iOS mein always true
    };


    // ✅ Convert image to base64 format - IMPROVED VERSION
    const convertImageToBase64 = async (imageUri) => {
        try {
            console.log('Converting image to base64:', imageUri);

            const response = await fetch(imageUri);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        // Remove data:image/jpeg;base64, prefix if present
                        const base64 = reader.result.split(',')[1] || reader.result;
                        resolve(base64);
                    } else {
                        reject(new Error('Failed to read image file'));
                    }
                };
                reader.onerror = () => reject(new Error('FileReader error'));
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.log('Error converting image to base64:', error);
            throw error;
        }
    };
    // ✅ Handle photo upload with base64 conversion
    // const handlePhotoUpload = async () => {
    //     if (photos.length >= 10) {
    //         Alert.alert('Limit Reached', 'You can upload maximum 10 photos');
    //         return;
    //     }

    //     try {
    //         const hasPermission = await checkGalleryPermission();

    //         if (!hasPermission) {
    //             Alert.alert(
    //                 'Permission Denied',
    //                 'Storage permission is required to access gallery. Please enable it in app settings.',
    //                 [
    //                     { text: 'Cancel', style: 'cancel' },
    //                     {
    //                         text: 'Open Settings',
    //                         onPress: () => Linking.openSettings()
    //                     }
    //                 ]
    //             );
    //             return;
    //         }
    //         const image = await ImagePicker.openPicker({
    //             mediaType: 'photo',
    //             multiple: true,
    //             maxFiles: 10 - photos.length,
    //             cropping: true,
    //             compressImageQuality: 0.7, // Quality reduce karo for smaller size
    //             compressImageMaxWidth: 1024, // Max width limit
    //             compressImageMaxHeight: 1024, // Max height limit
    //             includeBase64: true, // ✅ Direct base64 lelo
    //             forceJpg: true,
    //         });

    //         // Handle single or multiple images
    //         const selectedImages = Array.isArray(image) ? image : [image];

    //         const newPhotos = await Promise.all(
    //             selectedImages.map(async (img, index) => {
    //                 // Agar ImagePicker se direct base64 mil raha hai toh use karo
    //                 let base64Data = img.data;

    //                 // Agar base64 nahi mila toh manually convert karo
    //                 if (!base64Data) {
    //                     base64Data = await convertImageToBase64(img.path);
    //                 }

    //                 return {
    //                     id: Date.now() + index,
    //                     uri: img.path,
    //                     base64: base64Data,
    //                     mime: img.mime || 'image/jpeg',
    //                     width: img.width,
    //                     height: img.height,
    //                 };
    //             })
    //         );

    //         setPhotos([...photos, ...newPhotos]);
    //         ToastAndroid.show(`${selectedImages.length} photo(s) added`, ToastAndroid.SHORT);

    //     } catch (error) {
    //         console.log('Gallery Error:', error);
    //         if (error.code === 'E_PERMISSION_MISSING') {
    //             Alert.alert('Permission Required', 'Please grant storage permission to access gallery');
    //         } else if (error.code !== 'E_PICKER_CANCELLED') {
    //             Alert.alert('Error', 'Cannot open gallery. Please check app permissions.');
    //         }
    //     }
    // };
    // ✅ Handle photo upload with base64 conversion - FIXED VERSION
    const handlePhotoUpload = async () => {
        if (photos.length >= 10) {
            Alert.alert('Limit Reached', 'You can upload maximum 10 photos');
            return;
        }

        try {
            const hasPermission = await checkGalleryPermission();

            if (!hasPermission) {
                Alert.alert(
                    'Permission Denied',
                    'Storage permission is required to access gallery. Please enable it in app settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
                return;
            }

            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                multiple: true,
                maxFiles: 10 - photos.length,
                cropping: true,
                compressImageQuality: 0.7,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                includeBase64: true,
                forceJpg: true,
            });

            // Handle single or multiple images
            const selectedImages = Array.isArray(image) ? image : [image];

            // ✅ FILTER OUT IMAGES WITHOUT VALID PATH OR DATA
            const validImages = selectedImages.filter(img =>
                img.path && (img.data || img.path) // Must have path and either data or path
            );

            if (validImages.length === 0) {
                ToastAndroid.show('No valid images selected', ToastAndroid.SHORT);
                return;
            }

            const newPhotos = await Promise.all(
                validImages.map(async (img, index) => {
                    try {
                        let base64Data = img.data;

                        // ✅ Agar base64 nahi mila toh manually convert karo with ERROR HANDLING
                        if (!base64Data) {
                            console.log(`Converting image ${index} to base64 manually`);
                            base64Data = await convertImageToBase64(img.path);
                        }

                        // ✅ Validate that we have base64 data
                        if (!base64Data) {
                            console.log(`Failed to get base64 for image ${index}`);
                            throw new Error('Failed to convert image to base64');
                        }

                        return {
                            id: Date.now() + index,
                            uri: img.path,
                            base64: base64Data,
                            mime: img.mime || 'image/jpeg',
                            width: img.width || 400,
                            height: img.height || 300,
                        };
                    } catch (error) {
                        console.log(`Error processing image ${index}:`, error);
                        return null; // Return null for failed images
                    }
                })
            );

            // ✅ FILTER OUT NULL VALUES (failed images)
            const successfulPhotos = newPhotos.filter(photo => photo !== null);

            if (successfulPhotos.length > 0) {
                setPhotos([...photos, ...successfulPhotos]);
                ToastAndroid.show(`${successfulPhotos.length} photo(s) added successfully`, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Failed to add any photos', ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log('Gallery Error:', error);
            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert('Permission Required', 'Please grant storage permission to access gallery');
            } else if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Cannot open gallery. Please check app permissions.');
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
            ToastAndroid.show('Photo added successfully', ToastAndroid.SHORT);

        } catch (error) {
            console.log('Gallery Error Details:', {
                code: error.code,
                message: error.message,
                platform: Platform.OS
            });

            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert(
                    'Permission Required',
                    'Please grant storage permission in app settings to access gallery',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
            } else if (error.code === 'E_NO_LIBRARY_PERMISSION') {
                Alert.alert(
                    'Gallery Access Denied',
                    'Please allow gallery access in your device settings',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
            } else if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert(
                    'Error',
                    'Cannot open gallery. Please check app permissions and try again.'
                );
            }
        }
    };



    // ✅ Remove media item with confirmation
    const removeMedia = (id, type) => {
        const mediaToRemove = type === 'photo'
            ? photos.find(photo => photo.id === id)
            : null;

        // ✅ EDIT MODE: Agar existing image hai toh confirmation show karo
        if (property && mediaToRemove?.isExisting) {
            setPhotoToDelete({ id, type });
            setConfirmationModalVisible(true);
        } else {
            // ✅ ADD MODE ya non-existing image: Direct remove karo
            performMediaDeletion(id, type);
        }
    };
    const [deletingImageId, setDeletingImageId] = useState(null);

    // ✅ Remove media item with API call and loading state
    const performMediaDeletion = async (id, type) => {
        if (type === 'photo') {
            const photoToRemove = photos.find(photo => photo.id === id);

            // ✅ Agar existing image hai (edit mode mein) aur img_id hai
            if (photoToRemove?.isExisting && photoToRemove?.img_id) {
                setDeletingImageId(id); // Loading state set karo

                try {
                    console.log('🗑️ Deleting existing image with ID:', photoToRemove.img_id);

                    const deleteResponse = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.delete_property_image}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pimage_id: photoToRemove.img_id
                        }),
                    });

                    const deleteResult = await deleteResponse.json();
                    console.log('🗑️ Delete API Response:', deleteResult);

                    if (deleteResult.code === 200) {
                        const updatedPhotos = photos.filter(photo => photo.id !== id);
                        setPhotos(updatedPhotos);
                        ToastAndroid.show('Image deleted successfully', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(deleteResult.message || 'Failed to delete image', ToastAndroid.SHORT);
                    }

                } catch (error) {
                    console.log('❌ Error deleting image:', error);
                    ToastAndroid.show('Network error while deleting image', ToastAndroid.SHORT);
                } finally {
                    setDeletingImageId(null); // Loading state clear karo
                }
            } else {
                // ✅ Agar new image hai ya add mode mein hai
                const updatedPhotos = photos.filter(photo => photo.id !== id);
                setPhotos(updatedPhotos);
                ToastAndroid.show('Photo removed', ToastAndroid.SHORT);
            }
        }
    };
    // ✅ Confirmation ke baad actual delete karega
    const handleConfirmDelete = () => {
        if (photoToDelete) {
            performMediaDeletion(photoToDelete.id, photoToDelete.type);
            setConfirmationModalVisible(false);
            setPhotoToDelete(null);
        }
    };

    // ✅ Modal close karega
    const handleCloseModal = () => {
        setConfirmationModalVisible(false);
        setPhotoToDelete(null);
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
        setVideoLink('');
        setDropdownVisible(false);
        setBudgetDropdownVisible(false);
        console.log('Form reset successfully');
    };


    // ✅ Validate Form - IMPROVED
    const validateForm = () => {
        let tempErrors = {};

        // if (!selectedCategory) tempErrors.category = 'Please select category';
        if (!title.trim()) tempErrors.title = 'Please enter property title';
        if (!price.trim()) tempErrors.price = 'Please enter property price';
        if (!location.trim()) tempErrors.location = 'Please enter property location';
        if (!selectedState) tempErrors.state = 'Please select state';
        if (!selectedCity) tempErrors.city = 'Please select city';
        if (photos.length === 0) tempErrors.photos = 'Please add at least one photo';

        // ✅ OPTIONAL: Agent validation agar required hai
        // if (!agentName.trim()) tempErrors.agentName = 'Please enter agent name';
        // if (!agentMobile.trim()) tempErrors.agentMobile = 'Please enter agent mobile';
        // if (agentMobile && agentMobile.length !== 10) tempErrors.agentMobile = 'Please enter valid 10-digit mobile number';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const closeAllDropdowns = () => {
        setDropdownVisible(false);
        setBudgetDropdownVisible(false);
        setStateDropdownVisible(false);
        setCityDropdownVisible(false);
    };

    const scrollViewRef = useRef(null);

    // ✅ ScrollView के touch event handle करें
    const handleScrollViewTouch = () => {
        closeAllDropdowns();
        // Keyboard.dismiss(); // कीबोर्ड भी बंद करें
    };


    // ✅ Jab bhi photos add/remove ho, error clear ho jaye
    useEffect(() => {
        if (photos.length > 0 && errors.photos) {
            setErrors(prev => ({ ...prev, photos: '' }));
        }
    }, [photos.length]);


    // ✅ Main Submit Function with Base64 Array
    // const handleSubmit = async () => {
    //     if (!validateForm()) return;

    //     setUploading(true);

    //     try {
    //         // ✅ Separate new and existing images
    //         // ✅ Prepare photos array in base64 format - ONLY FOR NEW IMAGES
    //         const photosBase64Array = await Promise.all(
    //             photos.map(async (photo) => {
    //                 // Agar existing image hai (edit mode mein) aur base64 nahi hai
    //                 if (photo.isExisting && !photo.base64) {
    //                     try {
    //                         // Existing image ko base64 mein convert karo
    //                         const base64Data = await convertImageToBase64(photo.uri);
    //                         return `data:${photo.mime};base64,${base64Data}`;
    //                     } catch (error) {
    //                         console.log('Error converting existing image to base64:', error);
    //                         // Agar convert nahi ho pa raha toh original URI use karo
    //                         return photo.uri;
    //                     }
    //                 }
    //                 // Agar new image hai ya existing image ka base64 hai
    //                 return `data:${photo.mime};base64,${photo.base64}`;
    //             })
    //         );

    //         // ✅ Filter out any failed conversions
    //         const validPhotosBase64Array = photosBase64Array.filter(photo =>
    //             photo && !photo.includes('undefined')
    //         );



    //         // ✅ Prepare JSON data
    //         const propertyData = {
    //             // ✅ Edit mode mein p_id add karein
    //             ...(property && { p_id: property.p_id }),
    //             category_id: selectedCategory.category_id || selectedCategory.id,
    //             product_name: title,
    //             description: description,
    //             type: propertyType,
    //             price: price,
    //             city: selectedCity ? (selectedCity.id || selectedCity.id) : property.city, // ✅ City ID bhejo
    //             state: selectedState ? (selectedState.id || selectedState.id) : property.state, // ✅ State ID bhejo
    //             location: location,
    //             amenities: amenities.join(','),
    //             budget: budget,
    //             size: area,
    //             map: mapLocation,
    //             p_status: propertyStatus,
    //             p_image: validPhotosBase64Array,
    //             p_video: videoLink // ✅ Video link
    //         };

    //         console.log('📤 Sending Property Data with Images:', {
    //             ...propertyData,
    //             p_image: `${photosBase64Array.length} images`,

    //         });

    //         const endpoint = property
    //             ? `${ApiConstant.URL}${ApiConstant.OtherURL.update_property}`
    //             : `${ApiConstant.URL}${ApiConstant.OtherURL.add_property}`;

    //         // ✅ API Call for JSON
    //         const response = await fetch(endpoint, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(propertyData),
    //         });

    //         const result = await response.json();
    //         console.log('📥 API Response:', result);

    //         if (result.code === 200) {
    //             const successMessage = property
    //                 ? 'Property updated successfully!'
    //                 : 'Property added successfully!';

    //             ToastAndroid.show(successMessage, ToastAndroid.LONG);

    //             if (!property) {
    //                 resetForm();
    //             }

    //             navigation.goBack();
    //         } else {
    //             ToastAndroid.show(result.message || 'Failed to save property', ToastAndroid.LONG);
    //         }

    //     } catch (error) {
    //         console.log('❌ Error adding property:', error);
    //         ToastAndroid.show('Network error occurred', ToastAndroid.LONG);
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    // ✅ Main Submit Function with Base64 Array - UPDATED FOR CORRECT IMAGE HANDLING
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setUploading(true);

        try {
            const userId = await AsyncStorage.getItem('id');
            // ✅ Separate existing and new images
            const existingImages = photos.filter(photo => photo.isExisting);
            const newImages = photos.filter(photo => !photo.isExisting);

            console.log('📸 Existing Images:', existingImages.length);
            console.log('📸 New Images:', newImages.length);

            // ✅ Convert only NEW images to base64
            const newImagesBase64 = await Promise.all(
                newImages.map(async (photo) => {
                    try {
                        return `data:${photo.mime};base64,${photo.base64}`;
                    } catch (error) {
                        console.log('Error with new image:', error);
                        return null;
                    }
                })
            );

            const validNewImages = newImagesBase64.filter(img => img !== null);

            console.log('📸 Valid New Images:', validNewImages.length);

            // ✅ Prepare JSON data
            const propertyData = {
                ...(property && { p_id: property.p_id }),
                category_id: selectedCategory.category_id || selectedCategory.id,
                user_id: userId,
                product_name: title,
                description: description,
                type: propertyType,
                price: price,
                city: selectedCity ? (selectedCity.id || selectedCity.id) : property.city,
                state: selectedState ? (selectedState.id || selectedState.id) : property.state,
                location: location,
                amenities: amenities.join(','),
                budget: budget,
                size: area,
                map: mapLocation,
                p_status: propertyStatus,
                p_video: videoLink,

            };

            // ✅ EDIT MODE: Sirf new images bhejo
            if (property) {
                propertyData.p_image = validNewImages;
                console.log('📤 EDIT MODE: Sending only new images:', validNewImages.length);

                // ✅ Agar existing images ki IDs bhejni hain (for deletion/replacement)
                const existingImageIds = existingImages.map(photo => photo.img_id).filter(id => id);
                if (existingImageIds.length > 0) {
                    propertyData.existing_image_ids = existingImageIds.join(',');
                    console.log('📤 Existing image IDs:', existingImageIds);
                }
            } else {
                // ADD MODE: Saari new images bhejo
                propertyData.p_image = validNewImages;
                console.log('📤 ADD MODE: Sending all images:', validNewImages.length);
            }

            console.log('📤 Final Property Data:', {
                ...propertyData,
                p_image: `${propertyData.p_image.length} images`
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'

            >
                <Header
                    title={property ? "Edit Property" : "Add Property"}
                    onBackPress={() => {
                        navigation.goBack()
                        closeAllDropdowns();
                    }}
                />

                <View style={{ padding: 20 }}>

                    {/* ✅ Category Modal */}
                    {/* ✅ Category Modal - React Native Element Dropdown */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Category
                    </Text>

                    <Dropdown
                        style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            height: 50,
                            marginBottom: 15,
                        }}
                        placeholderStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.PlaceHolderTextcolor,
                        }}
                        selectedTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        iconStyle={{
                            width: 20,
                            height: 20,
                        }}
                        data={listCategory.map(item => ({
                            label: item.category_name,
                            value: item.category_id,
                        }))}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Category"
                        value={selectedCategory?.category_id || null}
                        onChange={item => {
                            const selectedItem = listCategory.find(cat => cat.category_id === item.value);
                            setSelectedCategory(selectedItem || null);
                        }}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            marginTop: 8,
                        }}
                        itemTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        activeColor="#f0f8ff"
                        showsVerticalScrollIndicator={false}
                        renderItem={(item, selected) => (
                            <View>
                                <View style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    backgroundColor: selected ? '#f0f8ff' : '#fff',
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Medium',
                                        color: colors.TextColorBlack,
                                    }}>
                                        {item.label}
                                    </Text>
                                </View>
                                {/* ✅ Divider add kiya */}
                                <View style={{
                                    height: 1,
                                    backgroundColor: '#f0f0f0',
                                }} />
                            </View>
                        )}
                    />

                    {/* Rest of your existing UI components remain same */}
                    {/* Property Type Selection */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Property Type
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
                        marginBottom: 8,
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

                    </View>
                    {errors.title && <Text style={{ color: 'red', fontSize: 12 }}>{errors.title}</Text>}

                    {/* Description */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 15,
                        marginTop: 5,
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        {/* Price Input with Error */}
                        <View style={{ width: '48%' }}>
                            <View style={{
                                borderWidth: 1,
                                borderColor: errors.price ? 'red' : '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#f9f9f9',
                                paddingHorizontal: 12,
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
                                        setErrors(prev => ({ ...prev, price: '' }));
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                            {errors.price && (
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                    {errors.price}
                                </Text>
                            )}
                        </View>

                        {/* Area Input */}
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

                    <Dropdown
                        style={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            height: 50,
                            marginBottom: 15,

                        }}
                        placeholderStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.PlaceHolderTextcolor,
                        }}
                        selectedTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        iconStyle={{
                            width: 20,
                            height: 20,
                        }}
                        data={budgetOptions.map(item => ({
                            label: item,
                            value: item,
                        }))}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Budget Range"
                        value={budget}
                        onChange={item => {
                            setBudget(item.value);
                        }}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            marginTop: 8,
                        }}
                        itemTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        activeColor="#f0f8ff"
                        showsVerticalScrollIndicator={false}
                        renderItem={(item, selected) => (
                            <View>
                                <View style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    backgroundColor: selected ? '#f0f8ff' : '#fff',
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Medium',
                                        color: colors.TextColorBlack,
                                    }}>
                                        {item.label}
                                    </Text>
                                </View>
                                {/* ✅ Divider add kiya */}
                                <View style={{
                                    height: 1,
                                    backgroundColor: '#f0f0f0',

                                }} />
                            </View>
                        )}
                    />

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

                    {/* Full Address */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: errors.location ? 'red' : '#ddd',
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
                                setErrors(prev => ({ ...prev, location: '' }));
                            }}
                        />
                    </View>
                    {errors.location && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.location}</Text>}

                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        State *
                    </Text>

                    <Dropdown
                        style={{
                            borderWidth: 1,
                            borderColor: errors.state ? 'red' : '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                            paddingHorizontal: 12,
                            height: 50,
                            marginBottom: 15,
                        }}
                        placeholderStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.PlaceHolderTextcolor,
                        }}
                        selectedTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        inputSearchStyle={{
                            height: 40,
                            fontSize: 16,
                            fontFamily: 'Inter-Regular',
                            borderRadius: 8,
                            color: colors.TextColorBlack,
                        }}
                        iconStyle={{
                            width: 20,
                            height: 20,
                        }}
                        data={states.map(item => ({
                            label: item.state_name || item.name,
                            value: item.id || item.id,
                            originalItem: item // ✅ Original data access ke liye
                        }))}
                        search
                        maxHeight={250}
                        labelField="label"
                        valueField="value"
                        placeholder="Select State"
                        searchPlaceholder="Search state..."
                        value={selectedState?.id || null}
                        onChange={item => {
                            const selectedStateItem = states.find(state => state.id === item.value);
                            setSelectedState(selectedStateItem);
                            setSelectedCity(null);
                            setCity('');
                            setErrors(prev => ({ ...prev, state: '' }));
                        }}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            marginTop: 8,
                        }}
                        itemTextStyle={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        activeColor="#f0f8ff"
                        showsVerticalScrollIndicator={false}
                        renderItem={(item, selected) => (
                            <View>
                                <View style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    backgroundColor: selected ? '#f0f8ff' : '#fff',
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Medium',
                                        color: colors.TextColorBlack,
                                    }}>
                                        {item.label}
                                    </Text>
                                </View>
                                {/* ✅ Divider add kiya */}
                                <View style={{
                                    height: 1,
                                    backgroundColor: '#f0f0f0',
                                }} />
                            </View>
                        )}
                    />


                    {errors.state && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.state}</Text>}


                    {/* City Dropdown */}

                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        City *
                    </Text>

                    <View style={{ position: 'relative' }}>
                        <Dropdown
                            style={{
                                borderWidth: 1,
                                borderColor: errors.city ? 'red' : '#ddd',
                                borderRadius: 8,
                                backgroundColor: selectedState ? '#f9f9f9' : '#f0f0f0',
                                paddingHorizontal: 12,
                                height: 50,
                                marginBottom: 15,
                            }}
                            placeholderStyle={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: selectedState ? colors.PlaceHolderTextcolor : '#999',
                            }}
                            selectedTextStyle={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            inputSearchStyle={{
                                height: 40,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                borderRadius: 8,
                                color: colors.TextColorBlack,
                            }}
                            iconStyle={{
                                width: 20,
                                height: 20,
                            }}
                            data={cities.map(item => ({
                                label: item.city_name || item.name,
                                value: item.id || item.id,
                                originalItem: item
                            }))}
                            search
                            maxHeight={250}
                            labelField="label"
                            valueField="value"
                            placeholder={loadingCities ? "Loading cities..." : (selectedState ? "Select City" : "First select state")}
                            searchPlaceholder="Search city..."
                            value={selectedCity?.id || null}
                            onChange={item => {
                                const selectedCityItem = cities.find(city => city.id === item.value);
                                setSelectedCity(selectedCityItem);
                                setCity(selectedCityItem.city_name || selectedCityItem.name);
                                setErrors(prev => ({ ...prev, city: '' }));
                            }}
                            onFocus={() => {
                                if (!selectedState) {
                                    return false;
                                }
                            }}
                            containerStyle={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                backgroundColor: '#fff',
                                marginTop: 8,
                            }}
                            itemTextStyle={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            activeColor="#f0f8ff"
                            showsVerticalScrollIndicator={false}
                            disable={!selectedState || loadingCities}
                            // ✅ Yeh add karo scroll issue fix karne ke liye
                            flatListProps={{
                                nestedScrollEnabled: true,
                                keyboardShouldPersistTaps: 'handled',
                                maintainVisibleContentPosition: {
                                    minIndexForVisible: 0
                                }
                            }}
                            renderItem={(item, selected) => (
                                <View>
                                    <View style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 8,
                                        backgroundColor: selected ? '#f0f8ff' : '#fff',
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontFamily: 'Inter-Medium',
                                            color: colors.TextColorBlack,
                                        }}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    <View style={{
                                        height: 1,
                                        backgroundColor: '#f0f0f0',
                                    }} />
                                </View>
                            )}
                        />
                    </View>

                    {errors.city && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.city}</Text>}


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
                    <View style={{
                        marginBottom: 15,
                        borderWidth: errors.photos ? 1 : 0,
                        borderColor: errors.photos ? 'red' : 'transparent',
                        borderRadius: 8,
                        padding: errors.photos ? 12 : 0,
                        backgroundColor: errors.photos ? '#FFF5F5' : 'transparent',
                    }}>
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
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                            marginBottom: 15,
                        }}>
                            {photos.map((photo) => (
                                <View key={photo.id} style={{ position: 'relative', marginRight: 10 }}>
                                    <Image
                                        source={{ uri: photo.uri }}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: 8,
                                            opacity: deletingImageId === photo.id ? 0.5 : 1,
                                        }}
                                    />

                                    {/* ✅ Existing Image Badge (Edit Mode) */}
                                    {photo.isExisting && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 5,
                                            left: 5,
                                            backgroundColor: 'rgba(76, 175, 80, 0.9)',
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 4,
                                        }}>
                                            <Text style={{
                                                fontSize: 10,
                                                fontFamily: 'Inter-Bold',
                                                color: '#fff',
                                            }}>
                                                Existing
                                            </Text>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            backgroundColor: deletingImageId === photo.id ? '#ff6b6b' : 'rgba(0,0,0,0.7)',
                                            borderRadius: 12,
                                            width: 24,
                                            height: 24,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => removeMedia(photo.id, 'photo')}
                                        disabled={deletingImageId === photo.id}
                                    >
                                        {deletingImageId === photo.id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Ionicons name="close" size={16} color="#fff" />
                                        )}
                                    </TouchableOpacity>

                                    {/* Loading overlay */}
                                    {deletingImageId === photo.id && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <ActivityIndicator size="small" color="#fff" />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                        {/* ✅ Photos Error Message */}
                        {errors.photos && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                                <Ionicons name="warning-outline" size={14} color="red" />
                                <Text style={{
                                    color: 'red',
                                    fontSize: 12,
                                    fontFamily: 'Inter-Regular',
                                    marginLeft: 4,
                                }}>
                                    {errors.photos}
                                </Text>
                            </View>
                        )}

                        {/* ✅ Photos Requirement Hint */}
                        {photos.length === 0 && !errors.photos && (
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                fontStyle: 'italic',
                                marginTop: 5,
                            }}>
                                At least one photo is required
                            </Text>
                        )}
                    </View>

                    {/* ✅ Video Link Section */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                        marginTop: 10,
                    }}>
                        Video Link (Optional)
                    </Text>

                    <View style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 20,
                    }}>
                        <TextInput
                            style={{
                                paddingVertical: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Paste YouTube/Vimeo video link"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={videoLink}
                            onChangeText={setVideoLink}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        marginBottom: 15,
                        fontStyle: 'italic',
                    }}>
                        Note: Paste YouTube or Vimeo video URL only
                    </Text>





                    {/* Submit Button */}
                    <CustomButton
                        title={uploading ? "Uploading..." : (property ? "Update Property" : "Add Property")}
                        onPress={handleSubmit}
                        variant="primary"
                        size="large"
                        disabled={uploading}
                    />

                    <ConfirmationModal
                        visible={confirmationModalVisible}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmDelete}
                        title="Delete Photo"
                        message="Are you sure you want to delete this photo? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        type="delete"
                    />



                </View>
            </ScrollView>
            <Bottomtab />
        </SafeAreaView>
    );
};

export default AgentAddProperty;