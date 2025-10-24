import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import CountryCodePicker from '../components/CountryCodePicker';

const Registration = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('Agent');
    const [countryCode, setCountryCode] = useState('+91');
    const navigation = useNavigation();

    const handleRegister = () => {
        const fullPhoneNumber = countryCode + phoneNumber; // ✅ Country code + phone number
        console.log('Login attempted:', {
            name,
            phoneNumber: fullPhoneNumber,
            password
        });
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 }}>
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

                <View style={{ marginBottom: 30, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 16,
                            marginBottom: 10,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                        I am
                    </Text>

                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#007AFF', borderRadius: 8, overflow: 'hidden' }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Agent' ? '#007AFF' : '#fff',
                            }}
                            onPress={() => setUserType('Agent')}>
                            <Text style={{ color: userType === 'Agent' ? '#fff' : '#007AFF', fontFamily: 'Inter-Bold' }}>
                                Agent
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30,
                                backgroundColor: userType === 'Customer' ? '#007AFF' : '#fff',
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
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 20,
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

                {/* ✅ Phone Number Input with Country Code Picker */}
                <View style={{
                    flexDirection: 'row',

                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    backgroundColor: '#f9f9f9',
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
                {/* Email Input */}
                <View
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

                {/* Address Input */}
                <View
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
                    />
                </View>


                {/* Password Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        paddingHorizontal: 12,
                        marginBottom: 30,
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
                <CustomButton
                    title="Sign Up"
                    onPress={handleRegister}
                    variant="primary"
                    size="medium"
                />

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
                            color: '#fff',
                            fontSize: 18,
                            fontFamily: 'Inter-Bold',
                        }}>
                        Back to Login
                    </Text>
                </TouchableOpacity> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Registration;
