import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleLogin = () => {
        console.log('Login attempted:', { phoneNumber, password, name });
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

                {/* Phone Number Input */}
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
                <CustomButton
                    title="Log in"
                    onPress={handleLogin}
                    variant="primary"
                    size="medium"
                />

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
