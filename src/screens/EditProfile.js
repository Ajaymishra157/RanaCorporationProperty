import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import CountryCodePicker from '../components/CountryCodePicker';
import CustomAlert from '../components/CustomAlert';
import ApiConstant from '../constants/ApiConstant';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
    const navigation = useNavigation();

    // State for form fields
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [alternateNumber, setAlternateNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [userType, setUserType] = useState('');

    // Country codes
    const [countryCode, setCountryCode] = useState('+91');
    const [alternateCountryCode, setAlternateCountryCode] = useState('+91');

    // UI state
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Fetch user profile data
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userId = await AsyncStorage.getItem('id');

            if (!userId) {
                setAlertMessage('User not found. Please login again.');
                setAlertVisible(true);
                return;
            }

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId
                }),
            });

            const result = await response.json();

            if (result.code === 200 && Array.isArray(result.payload) && result.payload.length > 0) {
                const userData = result.payload[0];

                // Populate form with existing data
                setName(userData.staff_name || '');
                setEmail(userData.email || '');
                setPhoneNumber(userData.whatsapp_number || '');
                setAlternateNumber(userData.alternative_number || '');
                setAddress(userData.address || '');
                setUserType(userData.user_type || 'Agent');

                // Set country codes if available in data, otherwise use defaults
                if (userData.country_code) {
                    setCountryCode(userData.country_code);
                }
                if (userData.alternative_country_code) {
                    setAlternateCountryCode(userData.alternative_country_code);
                }

            } else {
                setAlertMessage('Failed to load profile data');
                setAlertVisible(true);
            }
        } catch (error) {
            console.log('Error fetching profile data:', error);
            setAlertMessage('Error loading profile data');
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const validateForm = () => {
        let errors = [];

        // Check all required fields
        if (!name.trim()) {
            errors.push('name');
        }
        if (!email.trim()) {
            errors.push('email');
        }

        // If any required field is empty
        if (errors.length > 0) {
            if (errors.length === 2) {
                setAlertMessage('Name and Email are required');
            } else {
                const fieldName = errors[0] === 'name' ? 'Name' : 'Email';
                setAlertMessage(`${fieldName} is required`);
            }
            setAlertVisible(true);
            return false;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setAlertMessage('Please enter a valid email address');
            setAlertVisible(true);
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('id');


            if (!userId) {
                setAlertMessage('User not found. Please login again.');
                setAlertVisible(true);
                setLoading(false);
                return;
            }

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.update_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_id: userId,
                    staff_name: name.trim(),
                    country_code: countryCode,
                    email: email.trim(),
                    whatsapp_number: phoneNumber,
                    alternative_number: alternateNumber || '',
                    address: address.trim(),
                    user_type: userType
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the server');
            }

            const data = await response.json();
            console.log('Update Profile Response:', data);

            if (data.code === 200) {
                ToastAndroid.show('Profile Updated Successfully!', ToastAndroid.SHORT);

                // Navigate back to profile screen
                navigation.goBack();
            } else {
                setAlertMessage(data.message || 'Update failed. Please try again.');
                setAlertVisible(true);
            }
        } catch (error) {
            console.error('Update Profile Error:', error.message);
            setAlertMessage('Something went wrong. Please try again later.');
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    if (loading && !name) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
                <Header
                    title="Edit Profile"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.AppColor} />
                    <Text style={{ marginTop: 10, fontFamily: 'Inter-Regular', color: colors.TextColorBlack }}>
                        Loading profile data...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <Header
                title="Edit Profile"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 40
                }}
                keyboardShouldPersistTaps='handled'
            >

                {/* User Type Selection (Read-only) */}
                <View style={{ marginBottom: 30 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            marginBottom: 10,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                        Account Type
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#007AFF',
                        borderRadius: 8,
                        overflow: 'hidden',
                        width: '100%',
                        opacity: 0.7 // Make it look disabled
                    }}>
                        <View
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Agent' ? '#007AFF' : '#fff',
                                width: '50%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                color: userType === 'Agent' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold'
                            }}>
                                Agent
                            </Text>
                        </View>

                        <View
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Customer' ? '#007AFF' : '#fff',
                                width: '50%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                color: userType === 'Customer' ? '#fff' : '#007AFF',
                                fontFamily: 'Inter-Bold'
                            }}>
                                Customer
                            </Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 12,
                        color: '#666',
                        fontFamily: 'Inter-Regular',
                        marginTop: 5,
                    }}>
                        Account type cannot be changed
                    </Text>
                </View>

                {/* Name Input */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        Full Name *
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            paddingHorizontal: 12,
                        }}>
                        <Ionicons name="person-outline" size={20} color="#888" />
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                {/* Email Input */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        Email Address *
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            paddingHorizontal: 12,
                        }}>
                        <Ionicons name="mail-outline" size={20} color="#888" />
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Enter your Email"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Phone Number Input */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        WhatsApp Number
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                    }}>
                        <CountryCodePicker
                            selectedCode={countryCode}
                            onSelect={setCountryCode}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Enter Phone number"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Alternate Number Input */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        Alternate Number
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                    }}>
                        <CountryCodePicker
                            selectedCode={alternateCountryCode}
                            onSelect={setAlternateCountryCode}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}
                            placeholder="Enter Alternate number"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={alternateNumber}
                            onChangeText={setAlternateNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Address Input */}
                <View style={{ marginBottom: 30 }}>
                    <Text style={{
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                    }}>
                        Address
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            borderWidth: 1,
                            borderColor: '#ddd',
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            paddingHorizontal: 12,
                            minHeight: 100,
                        }}>
                        <Ionicons name="location-outline" size={20} color="#888" style={{ marginTop: 12 }} />
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                textAlignVertical: 'top',
                            }}
                            placeholder="Enter your Address"
                            placeholderTextColor={colors.PlaceHolderTextcolor}
                            value={address}
                            onChangeText={setAddress}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <CustomButton
                            title="Cancel"
                            onPress={handleCancel}
                            variant="secondary"
                            size="medium"
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        {loading ? (
                            <View style={{
                                paddingVertical: 12,
                                backgroundColor: colors.AppColor,
                                borderRadius: 8,
                                alignItems: 'center'
                            }}>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : (
                            <CustomButton
                                title="Update Profile"
                                onPress={handleUpdateProfile}
                                variant="primary"
                                size="medium"
                            />
                        )}
                    </View>
                </View>

                {/* Custom Alert Popup */}
                <CustomAlert
                    visible={alertVisible}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;