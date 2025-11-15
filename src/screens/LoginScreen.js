import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ToastAndroid, Image } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import ApiConstant from '../constants/ApiConstant';
import CountryCodePicker from '../components/CountryCodePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [EmailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigation = useNavigation();
    const [countryCode, setCountryCode] = useState('+91');
    const [Loading, setLoading] = useState(false);

    const handleLogin = async () => {
        let isValid = true;

        // Reset errors
        setEmailError('');
        setPasswordError('');
        setLoginError('');

        // Validation for Mobile
        if (!email) {
            setEmailError('Please Enter Email id/Mobile');
            isValid = false;
        }

        // Password validation (minimum 4 characters)
        if (password.length < 6) {
            setPasswordError('Password Must be 6 Character');
            isValid = false;
        }



        if (isValid) {
            setLoading(true);
            try {
                // const fullPhoneNumber = countryCode + email;
                console.log('contrycode ye hai', countryCode, email, password)
                const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.login}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        country_code: countryCode,
                        username: email,
                        password: password,

                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to connect to the server');
                }

                const data = await response.json();
                console.log('Response:', data);

                // Check response status
                if (data.code == 200) {
                    ToastAndroid.show('Login Successfully', ToastAndroid.SHORT);
                    const Id = data.payload.id;
                    const username = data.payload.staff_name;
                    const userType = data.payload.user_type;

                    await AsyncStorage.setItem('id', Id);
                    await AsyncStorage.setItem('staff_name', username);
                    await AsyncStorage.setItem('user_type', userType);


                    // Navigate based on user type
                    let initialScreen = 'AgentDashboard'; // default
                    if (userType === 'Customer') {
                        initialScreen = 'CustomerScreen';
                    }

                    navigation.reset({
                        index: 0, // Reset the stack
                        routes: [{ name: initialScreen }], // Navigate to initialScreen
                    });
                } else {
                    setLoginError(data.message || 'Invalid credentials');
                }
            } catch (error) {
                console.error('Error:', error.message);
                setLoginError('Something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
                {/* Header */}
                <Text
                    style={{
                        fontSize: 28,
                        textAlign: 'center',
                        marginBottom: 40,
                        color: colors.TextColorBlack,
                        fontFamily: 'Inter-Bold',
                    }}>
                    Login
                </Text>

                {/* Name Input */}
                <View
                    style={{
                        flexDirection: 'row',

                        borderWidth: 1,
                        borderColor: EmailError ? 'red' : '#d1d5db',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',

                        marginBottom: 20,


                    }}>
                    {/* Country Code Picker */}
                    <CountryCodePicker
                        selectedCode={countryCode}
                        onSelect={setCountryCode}
                    />
                    {/* <Ionicons name="mail-outline" size={20} color="#888" /> */}
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            fontSize: 16,

                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        placeholder="Enter Mobile"
                        keyboardType='number-pad'
                        placeholderTextColor={colors.PlaceHolderTextcolor}
                        value={email}
                        maxLength={10}
                        onChangeText={setEmail}
                        autoCapitalize="words"
                    />

                </View>
                {EmailError ? (
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 14,
                            marginBottom: 5,
                            marginLeft: 15,
                            fontFamily: 'Inter-Regular',
                        }}>
                        {EmailError}
                    </Text>
                ) : null}

                {/* Phone Number Input */}
                {/* <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 20,
                    }}>
                    <Ionicons name="call-outline" size={20} color="#888" />
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            fontSize: 16,

                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}
                        placeholder="Enter your phone number"
                        placeholderTextColor={colors.PlaceHolderTextcolor}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View> */}

                {/* Password Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: passwordError ? 'red' : '#d1d5db',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 20,
                    }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#888" />
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            fontSize: 16,

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
                {passwordError ? (
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 14,
                            marginBottom: 5,
                            marginLeft: 15,
                            fontFamily: 'Inter-Regular',
                        }}>
                        {passwordError}
                    </Text>
                ) : null}

                {/* Forgot Password */}
                <TouchableOpacity
                    style={{ alignSelf: 'flex-end', marginBottom: 30 }}
                    onPress={handleForgotPassword}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.AppColor,
                            fontFamily: 'Inter-Regular',
                        }}>
                        Forgot password?
                    </Text>
                </TouchableOpacity>

                {/* Login Button */}
                {Loading ? (
                    <View>
                        <ActivityIndicator size="small" color={'#3b82f6'} />
                    </View>
                ) : (
                    <CustomButton
                        title="Log in"
                        onPress={handleLogin}
                        variant="primary"
                        size="medium"
                    />
                )}
                {loginError ? (
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 14,
                            marginBottom: 10,
                            marginLeft: 15,
                            fontFamily: 'Inter-Regular',
                        }}>
                        {loginError}
                    </Text>
                ) : null}

                {/* Register Button */}
                <CustomButton
                    title="Register With Us"
                    onPress={() => navigation.navigate('Registration')}
                    variant="secondary"
                    size="medium"
                    style={{ marginTop: 10 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
