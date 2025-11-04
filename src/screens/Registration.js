import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import CountryCodePicker from '../components/CountryCodePicker';
import CustomAlert from '../components/CustomAlert';
import ApiConstant from '../constants/ApiConstant';

const Registration = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [alternateNumber, setAlternateNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('Salesman');
    const [countryCode, setCountryCode] = useState('+91');
    const [alternateCountryCode, setAlternateCountryCode] = useState('+91');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigation = useNavigation();
    const [Loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            setAlertMessage('Please enter your name');
            setAlertVisible(true);
            return false;
        }

        if (!email.trim()) {
            setAlertMessage('Please enter your email');
            setAlertVisible(true);
            return false;
        }

        if (!password.trim()) {
            setAlertMessage('Please enter your password');
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

        // Password length validation
        if (password.length < 6) {
            setAlertMessage('Password must be at least 6 characters long');
            setAlertVisible(true);
            return false;
        }

        return true;
    };
    const handleRegister = async () => {
        console.log("called ");
        // ✅ Pehle validation check karein
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // const fullPhoneNumber = countryCode + phoneNumber;
            // const fullAlternateNumber = alternateCountryCode + alternateNumber;

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.Add_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_name: name.trim(),
                    country_code: countryCode,
                    email: email.trim(),
                    password: password,
                    whatsapp_number: phoneNumber,
                    alternative_number: alternateNumber || null,
                    address: address.trim(),
                    user_type: userType // 'Salesman' or 'Customer'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the server');
            }

            const data = await response.json();
            console.log('Registration Response:', data);

            // Check response status
            if (data.code === 200) {
                ToastAndroid.show('Registration Successful!', ToastAndroid.SHORT);

                // ✅ Registration successful hone ke baad login screen par redirect karenge
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                });
            } else {
                setRegistrationError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error.message);
            setRegistrationError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };
    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={{
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: '#fff',
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.TextColorBlack} />
                </TouchableOpacity>

            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 }} keyboardShouldPersistTaps='handled'>

                {/* Header */}
                <Text
                    style={{
                        fontSize: 22,
                        textAlign: 'center',
                        marginBottom: 40,
                        color: colors.TextColorBlack,
                        fontFamily: 'Inter-Bold',
                    }}>
                    Sign Up to Showcase your Property to Customers
                </Text>

                <View style={{ marginBottom: 30 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            marginBottom: 10,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                        I am
                    </Text>

                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#007AFF', borderRadius: 8, overflow: 'hidden', width: '100%' }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Salesman' ? '#007AFF' : '#fff',
                                width: '50%', justifyContent: 'center', alignItems: 'center'
                            }}
                            onPress={() => setUserType('Salesman')}>
                            <Text style={{ color: userType === 'Salesman' ? '#fff' : '#007AFF', fontFamily: 'Inter-Bold' }}>
                                Agent
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Customer' ? '#007AFF' : '#fff',
                                width: '50%', justifyContent: 'center', alignItems: 'center'
                            }}
                            onPress={() => setUserType('Customer')}>
                            <Text style={{ color: userType === 'Customer' ? '#fff' : '#007AFF', fontFamily: 'Inter-Bold' }}>
                                Customer
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Name Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderTopLeftRadius: 8, borderTopRightRadius: 8,
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
                {/* Email Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderTopWidth: 0,
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

                    />
                </View>
                {/* Password Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderTopWidth: 0,
                        borderColor: '#ddd',
                        borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                        backgroundColor: '#fff',
                        paddingHorizontal: 12,
                        marginBottom: 30

                    }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#888" />
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            fontSize: 16,
                            color: 'black',
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.PlaceHolderTextcolor}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>

                {/* ✅ Phone Number Input with Country Code Picker */}
                <View style={{
                    flexDirection: 'row',

                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    marginBottom: 20,
                }}>
                    {/* Country Code Picker */}
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
                <View style={{
                    flexDirection: 'row',

                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    marginBottom: 20,
                }}>
                    {/* Country Code Picker */}
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


                {/* Address Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        paddingHorizontal: 12,
                        marginBottom: 20,
                    }}>
                    <Ionicons name="location-outline" size={20} color="#888" />
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        placeholder="Enter your Address"
                        placeholderTextColor={colors.PlaceHolderTextcolor}
                        value={address}
                        onChangeText={setAddress}
                        multiline={true}
                    />
                </View>




                {/* Forgot Password */}
                {/* <TouchableOpacity
                    style={{ alignSelf: 'flex-end', marginBottom: 30 }}
                    onPress={handleForgotPassword}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#007AFF',
                            fontFamily: 'Inter-Regular',
                        }}>
                        Forgot password?
                    </Text>
                </TouchableOpacity> */}

                {/* Register Button */}
                {Loading ? (
                    <View>
                        <ActivityIndicator size="small" color={'#3b82f6'} />
                    </View>
                ) : (
                    <CustomButton
                        title="Sign Up"
                        onPress={handleRegister}
                        variant="primary"
                        size="medium"
                    />
                )}

                {/* Back to Login */}
                {/* <TouchableOpacity
                    style={{
                        backgroundColor: '#ff0000ff',
                        paddingVertical: 16,
                        marginTop: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                    onPress={() => navigation.navigate('LoginScreen')}>
                    <Text
                        style={{
                            color: '#f9f9f9',
                            fontSize: 18,
                            fontFamily: 'Inter-Bold',
                        }}>
                        Back to Login
                    </Text>
                </TouchableOpacity> */}

                {/* ✅ Custom Alert Popup */}
                <CustomAlert
                    visible={alertVisible}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Registration;
