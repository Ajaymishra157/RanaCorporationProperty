import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    ActivityIndicator,
    ToastAndroid,
    Platform,
    Linking,
    PermissionsAndroid
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../constants/Colors'
import ImagePicker from 'react-native-image-crop-picker';

const PostProperty = () => {
    const navigation = useNavigation()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        propertyType: '',
        price: '',
        location: '',
        area: '',
        description: '',
        amenities: []
    })
    const [photos, setPhotos] = useState([]);
    const [videoLink, setVideoLink] = useState('');
    const [deletingImageId, setDeletingImageId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // ✅ Check Gallery Permission Function
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
    // ✅ Convert Image to Base64 Function
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

    // ✅ Handle Photo Upload from Gallery
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

    // ✅ Handle Take Photo with Camera
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
                includeBase64: false, // Use URI
            });

            const newPhoto = {
                id: Date.now(),
                uri: image.path,
                mime: image.mime || 'image/jpeg',
                width: image.width,
                height: image.height,
            };

            setPhotos([...photos, newPhoto]);
            ToastAndroid.show('Photo added successfully', ToastAndroid.SHORT);

        } catch (error) {
            console.log('Camera Error:', error);
            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera permission in app settings',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
            } else if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert(
                    'Error',
                    'Cannot open camera. Please check app permissions and try again.'
                );
            }
        }
    };

    // ✅ Remove Photo Function
    const removePhoto = (photoId) => {
        setDeletingImageId(photoId);
        setTimeout(() => {
            setPhotos(photos.filter(photo => photo.id !== photoId));
            setDeletingImageId(null);
        }, 300);
    };

    const steps = [
        { id: 1, title: 'Basic Info', icon: 'home-outline' },
        { id: 2, title: 'Details', icon: 'list-outline' },
        { id: 3, title: 'Photos', icon: 'camera-outline' },
        { id: 4, title: 'Contact', icon: 'call-outline' }
    ]

    const propertyTypes = [
        { id: 1, name: 'Residential', icon: 'home' },
        { id: 2, name: 'Commercial', icon: 'business' },
        { id: 3, name: 'Rent', icon: 'key' },
        { id: 4, name: 'Plot/Land', icon: 'location-on' }
    ];

    const amenitiesList = [
        { id: 1, name: 'Parking', icon: 'local-parking' },
        { id: 2, name: 'Swimming Pool', icon: 'pool' },
        { id: 3, name: 'Gym', icon: 'fitness-center' },
        { id: 4, name: 'Garden', icon: 'yard' },
        { id: 5, name: 'Security', icon: 'security' },
        { id: 6, name: 'Lift', icon: 'elevator' },
        { id: 7, name: 'Power Backup', icon: 'power' },
        { id: 8, name: 'Water Supply', icon: 'water' },
        { id: 9, name: 'Park', icon: 'park' },
        { id: 10, name: 'Club House', icon: 'holiday-village' }
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        } else {
            console.log('Form submitted:', formData)
            console.log('Photos:', photos)
            console.log('Video Link:', videoLink)
            navigation.goBack()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            navigation.goBack()
        }
    }

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>
                            Property Type & Location
                        </Text>

                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            Property Type
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            {propertyTypes.map(type => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        {
                                            flex: 1,
                                            minWidth: '45%',
                                            alignItems: 'center',
                                            padding: 16,
                                            borderWidth: 2,
                                            borderColor: '#e0e0e0',
                                            borderRadius: 12,
                                            backgroundColor: '#fafafa'
                                        },
                                        formData.propertyType === type.name && {
                                            borderColor: '#4CAF50',
                                            backgroundColor: '#E8F5E9'
                                        }
                                    ]}
                                    onPress={() => setFormData({ ...formData, propertyType: type.name })}
                                >
                                    <MaterialIcons
                                        name={type.icon}
                                        size={24}
                                        color={formData.propertyType === type.name ? '#4CAF50' : '#666'}
                                    />
                                    <Text style={[
                                        { marginTop: 8, fontSize: 14, color: '#666' },
                                        formData.propertyType === type.name && { color: '#4CAF50', fontWeight: '600' }
                                    ]}>
                                        {type.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            Location
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                marginBottom: 16,
                                backgroundColor: '#fff',
                                color: 'black'
                            }}
                            placeholder="Enter property location"
                            placeholderTextColor='#ccc'
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                        />

                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            Price
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                marginBottom: 16,
                                backgroundColor: '#fff',
                                color: 'black'
                            }}
                            placeholder="Enter property price"
                            placeholderTextColor='#ccc'
                            keyboardType="numeric"
                            value={formData.price}
                            onChangeText={(text) => setFormData({ ...formData, price: text })}
                        />
                    </View>
                )

            case 2:
                return (
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>
                            Property Details
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>

                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                                    Area (sq ft)
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        padding: 12,
                                        fontSize: 16,
                                        backgroundColor: '#fff',
                                        color: 'black'
                                    }}
                                    placeholder="0"
                                    placeholderTextColor='#ccc'
                                    keyboardType="numeric"
                                    value={formData.area}
                                    onChangeText={(text) => setFormData({ ...formData, area: text })}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                                    Title
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        padding: 12,
                                        fontSize: 16,
                                        backgroundColor: '#fff',
                                        color: 'black'
                                    }}
                                    placeholder="Enter title"
                                    placeholderTextColor='#ccc'
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                />
                            </View>
                        </View>

                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            Description
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                marginBottom: 16,
                                backgroundColor: '#fff',
                                color: 'black',
                                height: 100,
                                textAlignVertical: 'top'
                            }}
                            placeholder="Describe your property..."
                            placeholderTextColor='#ccc'
                            multiline
                            numberOfLines={4}
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />

                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            Amenities
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {amenitiesList.map(amenity => (
                                <TouchableOpacity
                                    key={amenity.id}
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            borderWidth: 1,
                                            borderColor: '#e0e0e0',
                                            borderRadius: 20,
                                            backgroundColor: '#fafafa'
                                        },
                                        formData.amenities.includes(amenity.name) && {
                                            borderColor: '#4CAF50',
                                            backgroundColor: '#E8F5E9'
                                        }
                                    ]}
                                    onPress={() => toggleAmenity(amenity.name)}
                                >
                                    <MaterialIcons
                                        name={amenity.icon}
                                        size={20}
                                        color={formData.amenities.includes(amenity.name) ? '#4CAF50' : '#666'}
                                    />
                                    <Text style={[
                                        { marginLeft: 4, fontSize: 12, color: '#666' },
                                        formData.amenities.includes(amenity.name) && { color: '#4CAF50', fontWeight: '600' }
                                    ]}>
                                        {amenity.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )

            case 3:
                return (
                    <View style={{
                        marginBottom: 40,
                        padding: 20,
                    }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: 20,
                            textAlign: 'center'
                        }}>
                            Add Photos & Video
                        </Text>

                        {/* Photos Section */}
                        <View style={{
                            marginBottom: 25,
                            borderWidth: 2,
                            borderColor: '#4CAF50',
                            borderRadius: 12,
                            padding: 15,
                            backgroundColor: '#F9FDF9'
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: 15,
                            }}>
                                📸 Photos ({photos.length}/10)
                            </Text>

                            {/* Photo Upload Options */}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 15,
                                gap: 10
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.AppColor,
                                        paddingVertical: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 3,
                                    }}
                                    onPress={handlePhotoUpload}
                                >
                                    <Ionicons name="images-outline" size={20} color="#fff" />
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
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
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 3,
                                    }}
                                    onPress={handleTakePhoto}
                                >
                                    <Ionicons name="camera-outline" size={20} color="#fff" />
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#fff',
                                        marginLeft: 8,
                                    }}>
                                        Camera
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Photos Preview */}
                            {photos.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                                    marginBottom: 15,
                                }}>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        {photos.map((photo) => (
                                            <View key={photo.id} style={{
                                                position: 'relative',
                                                borderRadius: 8,
                                                overflow: 'hidden'
                                            }}>
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
                                                        backgroundColor: deletingImageId === photo.id ? '#ff6b6b' : 'rgba(0,0,0,0.7)',
                                                        borderRadius: 12,
                                                        width: 24,
                                                        height: 24,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => removePhoto(photo.id)}
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
                                    </View>
                                </ScrollView>
                            ) : (
                                <View style={{
                                    height: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#e0e0e0',
                                    borderStyle: 'dashed',
                                }}>
                                    <Ionicons name="images-outline" size={32} color="#ccc" />
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#666',
                                        marginTop: 8,
                                    }}>
                                        No photos added yet
                                    </Text>
                                </View>
                            )}

                            {/* Photos Requirement */}
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontStyle: 'italic',
                                textAlign: 'center',
                            }}>
                                {photos.length > 0
                                    ? `${photos.length} photo(s) added`
                                    : 'Add at least 3 photos for better visibility'
                                }
                            </Text>
                        </View>

                        {/* Video Link Section */}
                        <View style={{
                            borderWidth: 2,
                            borderColor: '#2196F3',
                            borderRadius: 12,
                            padding: 15,
                            backgroundColor: '#F8FBFF',
                            marginBottom: 20,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: 15,
                            }}>
                                🎥 Video Link (Optional)
                            </Text>

                            <View style={{
                                borderWidth: 1,
                                borderColor: '#2196F3',
                                borderRadius: 8,
                                backgroundColor: '#fff',
                                paddingHorizontal: 12,
                                marginBottom: 10,
                            }}>
                                <TextInput
                                    style={{
                                        paddingVertical: 12,
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: '#333',
                                    }}
                                    placeholder="Paste YouTube or Vimeo video URL"
                                    placeholderTextColor='#999'
                                    value={videoLink}
                                    onChangeText={setVideoLink}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                padding: 10,
                                backgroundColor: '#E3F2FD',
                                borderRadius: 8,
                            }}>
                                <Ionicons name="information-circle" size={16} color="#1976D2" />
                                <Text style={{
                                    fontSize: 12,
                                    color: '#1976D2',
                                    marginLeft: 8,
                                    flex: 1,
                                }}>
                                    Supported: YouTube, Vimeo links. Example: https://youtube.com/watch?v=...
                                </Text>
                            </View>

                            {/* Video Preview (if link exists) */}
                            {videoLink && (
                                <View style={{
                                    marginTop: 15,
                                    padding: 10,
                                    backgroundColor: '#E8F5E9',
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#2E7D32',
                                        marginLeft: 8,
                                        flex: 1,
                                    }}>
                                        Video link added successfully
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Photo Tips */}
                        <View style={{
                            backgroundColor: '#E3F2FD',
                            padding: 16,
                            borderRadius: 8,
                            borderLeftWidth: 4,
                            borderLeftColor: '#2196F3'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#1976D2',
                                marginBottom: 12,
                            }}>
                                📸 Photo Tips:
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark" size={14} color="#4CAF50" />
                                <Text style={{
                                    fontSize: 14,
                                    color: '#424242',
                                    marginLeft: 8,
                                    flex: 1,
                                }}>
                                    Take clear, well-lit photos
                                </Text>
                            </View>



                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark" size={14} color="#4CAF50" />
                                <Text style={{
                                    fontSize: 14,
                                    color: '#424242',
                                    marginLeft: 8,
                                    flex: 1,
                                }}>
                                    Show exterior and amenities
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark" size={14} color="#4CAF50" />
                                <Text style={{
                                    fontSize: 14,
                                    color: '#424242',
                                    marginLeft: 8,
                                    flex: 1,
                                }}>
                                    Upload high-quality images
                                </Text>
                            </View>
                        </View>

                        {/* Navigation Buttons */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 30,
                            gap: 15
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#6B7280',
                                    paddingVertical: 15,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                onPress={handleBack}
                            >
                                <Ionicons name="arrow-back" size={20} color="#fff" />
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#fff',
                                    marginLeft: 8,
                                }}>
                                    Previous
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: photos.length > 0 ? '#4CAF50' : '#9E9E9E',
                                    paddingVertical: 15,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                onPress={handleNext}
                                disabled={photos.length === 0}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#fff',
                                    marginRight: 8,
                                }}>
                                    Next
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )

            case 4:
                return (
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>
                            Contact Information
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                            borderRadius: 12,
                            backgroundColor: '#fafafa',
                            marginBottom: 16
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#4CAF50',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                    RS
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                                    Rahul Sharma
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                                    +91 98765 43210
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                                    rahul@example.com
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity style={{
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#4CAF50',
                            borderRadius: 8,
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <Text style={{ color: '#4CAF50', fontSize: 14, fontWeight: '600' }}>
                                Edit Contact Details
                            </Text>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            backgroundColor: '#E8F5E9',
                            borderRadius: 8
                        }}>
                            <Ionicons name="information-circle" size={20} color="#4CAF50" />
                            <Text style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#2E7D32' }}>
                                Your property will be reviewed and should be live within 24 hours
                            </Text>
                        </View>
                    </View>
                )

            default:
                return null
        }
    }


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setUploading(true);

        try {
            const userId = await AsyncStorage.getItem('id');
            // ✅ Separate existing and new images
            const existingImages = photos.filter(photo => photo.isExisting);
            const newImages = photos.filter(photo => !photo.isExisting);


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

                user_id: userId,
                product_name: title,
                description: description,

                price: price,
                city: selectedCity ? (selectedCity.id || selectedCity.id) : property?.city || '',
                state: selectedState ? (selectedState.id || selectedState.id) : property?.state || '',
                location: location,
                amenities: amenities.join(','),
                budget: budget,
                size: area,
                map: mapLocation,
                p_status: propertyStatus,
                p_video: videoLink,

            };

            // ✅ Category add karo agar available hai (OPTIONAL)
            if (selectedCategory) {
                propertyData.category_id = selectedCategory ? (selectedCategory.category_id || selectedCategory.id || '') : '';
            }

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: '#4CAF50'
            }}>
                <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    Post Property
                </Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Progress Steps */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                backgroundColor: '#f8f9fa'
            }}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={[
                                {
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 4
                                },
                                currentStep >= step.id ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#e0e0e0' }
                            ]}>
                                <Ionicons
                                    name={step.icon}
                                    size={16}
                                    color={currentStep >= step.id ? '#fff' : '#999'}
                                />
                            </View>
                            <Text style={[
                                { fontSize: 12, color: '#999' },
                                currentStep >= step.id && { color: '#4CAF50', fontWeight: '600' }
                            ]}>
                                {step.title}
                            </Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[
                                { flex: 1, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
                                currentStep > step.id && { backgroundColor: '#4CAF50' }
                            ]} />
                        )}
                    </React.Fragment>
                ))}
            </View>

            {/* Content */}
            <ScrollView style={{ flex: 1, padding: 20 }}>
                {renderStepContent()}
            </ScrollView>

            {/* Footer */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
                backgroundColor: '#fff'
            }}>
                <Text style={{ fontSize: 14, color: '#666' }}>
                    Step {currentStep} of {steps.length}
                </Text>
                <TouchableOpacity
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#4CAF50',
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 25,
                            gap: 8
                        },
                        currentStep === steps.length && { backgroundColor: '#2E7D32' }
                    ]}
                    onPress={handleNext}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                        {currentStep === steps.length ? 'Submit Property' : 'Continue'}
                    </Text>
                    <Ionicons
                        name={currentStep === steps.length ? "checkmark" : "arrow-forward"}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PostProperty

const styles = StyleSheet.create({})