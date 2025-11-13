import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    ToastAndroid,
    PermissionsAndroid,
    Platform,
    Alert,
    Linking
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import Header from '../components/Header'
import colors from '../constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ApiConstant from '../constants/ApiConstant'

const KYCVerification = () => {
    const navigation = useNavigation()

    // ✅ Separate states for each document
    const [aadharFront, setAadharFront] = useState(null)
    const [aadharBack, setAadharBack] = useState(null)
    const [panCard, setPanCard] = useState(null)

    const [errors, setErrors] = useState({})

    // ✅ Modal states
    const [imageSelectModal, setImageSelectModal] = useState(false)
    const [currentImageType, setCurrentImageType] = useState(null)
    const [previewModalVisible, setPreviewModalVisible] = useState(false)
    const [currentPreviewImage, setCurrentPreviewImage] = useState(null)
    const [currentImageTitle, setCurrentImageTitle] = useState('')

    const [uploading, setUploading] = useState(false)

    // ✅ Document types array
    const documentTypes = [
        {
            id: 'aadhar_front',
            title: 'Aadhar Card Front',
            required: true,
            state: aadharFront,
            setState: setAadharFront
        },
        {
            id: 'aadhar_back',
            title: 'Aadhar Card Back',
            required: true,
            state: aadharBack,
            setState: setAadharBack
        },
        {
            id: 'pan_card',
            title: 'PAN Card',
            required: true,
            state: panCard,
            setState: setPanCard
        }
    ]

    // ✅ Gallery Permission Check - AgentAddProperty jaisa
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

    // ✅ Open Image Selection Modal
    const openImageSelectModal = (docType) => {
        setCurrentImageType(docType)
        setImageSelectModal(true)
    }

    const closeImageSelectModal = () => {
        setImageSelectModal(false)
        setCurrentImageType(null)
    }

    // ✅ Camera permission function
    const requestCameraPermission = async () => {
        if (Platform.OS !== 'android') return true

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera to take photos',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            )
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.warn('Camera permission error:', err)
            return false
        }
    }

    // ✅ Handle Image Selection
    const handleImagePick = async (image) => {
        if (!image?.path) return;

        const documentData = {
            id: currentImageType.id,
            type: currentImageType.id,
            title: currentImageType.title,
            uri: image.path,
            name: `${currentImageType.id}_${Date.now()}.jpg`,
            mime: image.mime || 'image/jpeg',
            base64: image.data || '',  // 👈 store base64 here
        };

        // ✅ Update the specific state
        currentImageType.setState(documentData);

        if (errors[currentImageType.id]) {
            setErrors(prev => ({ ...prev, [currentImageType.id]: '' }));
        }

        closeImageSelectModal();
    };

    // ✅ Open Gallery
    // ✅ Open Gallery - IMPROVED VERSION
    const openGallery = async () => {
        try {
            // ✅ Permission check karo
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
                cropping: true,
                width: 300,
                height: 300,
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                includeBase64: true, // ✅ Base64 include karo
                forceJpg: true, // ✅ JPG format force karo
            });

            await handleImagePick(image);

        } catch (error) {
            console.log('Gallery Error:', error);
            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert('Permission Required', 'Please grant storage permission to access gallery');
            } else if (error.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Cannot open gallery. Please check app permissions.');
            }
        }
    }

    // ✅ Open Camera
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission()
        if (!hasPermission) {
            Alert.alert('Permission denied', 'Camera permission is required to take photos')
            return
        }

        try {
            const image = await ImagePicker.openCamera({
                mediaType: 'photo',
                cropping: true,
                width: 300,
                height: 300,
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                includeBase64: true,
            })
            await handleImagePick(image)
        } catch (error) {
            console.log('Error taking photo:', error)
            Alert.alert('Error', 'Error taking photo')
        }
    }

    // ✅ Remove Image
    const removeImage = (docType) => {
        docType.setState(null);
    }

    // ✅ Preview Image
    const previewImage = (document) => {
        setCurrentPreviewImage(document)
        setCurrentImageTitle(document.title)
        setPreviewModalVisible(true)
    }

    // ✅ Validate Form
    const validateForm = () => {
        const newErrors = {}

        documentTypes.forEach(docType => {
            if (docType.required && !docType.state) {
                newErrors[docType.id] = `${docType.title} is required`
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // ✅ Submit KYC
    const handleSubmit = async () => {
        try {
            setUploading(true);

            const staffId = await AsyncStorage.getItem('id');
            // ✅ First validate the form
            if (!validateForm()) {
                ToastAndroid.show('Please upload all required documents', ToastAndroid.LONG);
                return;
            }



            // ✅ Prepare final array in required format
            const idProofArray = [
                `data:${aadharFront.mime};base64,${aadharFront.base64}`,
                `data:${aadharBack.mime};base64,${aadharBack.base64}`,
                `data:${panCard.mime};base64,${panCard.base64}`,
            ];

            const payload = {
                staff_id: staffId,
                id_proof: idProofArray,
            };

            console.log('📤 Final Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.add_kyc}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            console.log('📥 Response:', result);

            if (result.code === 200) {
                ToastAndroid.show('KYC submitted successfully!', ToastAndroid.LONG);
                setAadharFront(null);
                setAadharBack(null);
                setPanCard(null);
                navigation.goBack();
            } else {
                ToastAndroid.show(result.message || 'Submission failed', ToastAndroid.LONG);
            }
        } catch (error) {
            console.log('❌ Error:', error);
            ToastAndroid.show('Something went wrong while submitting KYC', ToastAndroid.LONG);
        } finally {
            setUploading(false);
        }
    };


    // ✅ Render Document Upload Field
    const renderDocumentField = (docType) => {
        const document = docType.state;

        return (
            <View style={{ marginBottom: 20 }}>
                <Text style={{
                    fontSize: 14,
                    fontFamily: 'Inter-Medium',
                    color: '#555',
                    marginBottom: 8,
                }}>
                    {docType.title} {docType.required && (
                        <Text style={{ color: 'red', fontFamily: 'Inter-Bold' }}>*</Text>
                    )}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderStyle: document ? 'solid' : 'dashed',
                            borderColor: errors[docType.id] ? 'red' : (document ? '#4db6ac' : '#ddd'),
                            backgroundColor: document ? '#e0f7fa' : '#f8f9fa',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onPress={() => openImageSelectModal(docType)}
                    >
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: document ? '#00796b' : '#666',
                        }}>
                            {document ? 'File Selected' : 'Choose File'}
                        </Text>
                        <Ionicons name="document-attach-outline" size={20} color="#666" />
                    </TouchableOpacity>

                    {document && (
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <TouchableOpacity
                                style={{ padding: 8, marginLeft: 5 }}
                                onPress={() => previewImage(document)}
                            >
                                <Ionicons name="eye-outline" size={20} color={colors.AppColor} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ padding: 8, marginLeft: 5 }}
                                onPress={() => removeImage(docType)}
                            >
                                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {errors[docType.id] && (
                    <Text style={{
                        color: 'red',
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        marginTop: 4,
                    }}>
                        {errors[docType.id]}
                    </Text>
                )}
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                title="KYC Verification"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Instructions */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#E3F2FD',
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 20,
                    alignItems: 'center',
                }}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.AppColor} />
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                        color: '#1976D2',
                        marginLeft: 10,
                        flex: 1,
                    }}>
                        Please upload clear images of your documents for KYC verification
                    </Text>
                </View>

                {/* Document Upload Section */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: '#333',
                        marginBottom: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                        paddingBottom: 5,
                    }}>
                        Document Upload
                    </Text>

                    {/* Render all document types */}
                    {documentTypes.map(docType => renderDocumentField(docType))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: uploading ? '#ccc' : colors.AppColor,
                        paddingVertical: 15,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 20,
                        marginBottom: 30,
                    }}
                    onPress={handleSubmit}
                    disabled={uploading}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                    }}>
                        {uploading ? 'Uploading...' : 'Submit for Verification'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* ✅ Image Selection Modal - Gallery/Camera Options */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={imageSelectModal}
                onRequestClose={closeImageSelectModal}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    activeOpacity={1}
                    onPress={closeImageSelectModal}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            width: '80%',
                            paddingVertical: 5,
                        }}
                    >
                        <TouchableOpacity
                            onPress={closeImageSelectModal}
                            style={{
                                marginRight: 1,
                                backgroundColor: 'white',
                                borderRadius: 50,
                            }}
                        >
                            <Ionicons name="close" size={25} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                            alignItems: 'center',
                        }}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={e => e.stopPropagation()}
                    >
                        <Text style={{
                            fontSize: 16,
                            marginBottom: 20,
                            textAlign: 'center',
                            color: 'black',
                            fontFamily: 'Inter-Medium',
                        }}>
                            How would you like to upload your document?
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: colors.AppColor,
                                    padding: 15,
                                    borderRadius: 8,
                                    width: '45%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 10,
                                }}
                                onPress={openCamera}
                            >
                                <Ionicons name="camera-outline" size={20} color="black" />
                                <Text style={{
                                    color: 'black',
                                    fontFamily: 'Inter-Medium',
                                }}>
                                    Camera
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: colors.AppColor,
                                    padding: 15,
                                    borderRadius: 8,
                                    width: '45%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 10,
                                }}
                                onPress={openGallery}
                            >
                                <Ionicons name="images-outline" size={20} color="black" />
                                <Text style={{
                                    color: 'black',
                                    fontFamily: 'Inter-Medium',
                                }}>
                                    Gallery
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Image Preview Modal */}
            <Modal
                visible={previewModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPreviewModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        width: '90%',
                        maxHeight: '80%',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 15,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Inter-Bold',
                                color: '#333',
                            }}>
                                {currentImageTitle}
                            </Text>
                            <TouchableOpacity onPress={() => setPreviewModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {currentPreviewImage && (
                            <Image
                                source={{ uri: currentPreviewImage.uri }}
                                style={{
                                    width: '100%',
                                    height: 400,
                                    borderRadius: 8,
                                }}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default KYCVerification