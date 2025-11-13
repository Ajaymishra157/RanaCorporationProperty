import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';
import colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerEnquiry = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { property } = route.params || {};

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        city_id: '',
        remark: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);





    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city_id) {
            newErrors.city_id = 'Please select a city';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {

            return;
        }

        try {
            setLoading(true);

            const customer_id = await AsyncStorage.getItem('id');
            const payload = {
                ...formData,
                customer_id: customer_id || '',
                property_id: property?.p_id || '',
                property_title: property?.product_name || ''
            };

            console.log('Submitting enquiry:', payload);

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.add_enquiry}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.code === 200) {
                ToastAndroid.show('Enquiry submitted successfully!', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                ToastAndroid.show(result.message || 'Failed to submit enquiry', ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log('Enquiry submission error:', error);
            ToastAndroid.show('Network error. Please try again.', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <Header
                title="Submit Enquiry"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Property Info */}
                {property && (
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 16,
                        margin: 16,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'Inter-Bold',
                            color: colors.TextColorBlack,
                            marginBottom: 4,
                        }}>
                            {property.product_name || 'Property'}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Inter-Bold',
                            color: colors.AppColor,
                            marginBottom: 4,
                        }}>
                            ₹{Number(property.unit_price || property.price).toLocaleString()}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            {property.location || 'Location not available'}
                        </Text>
                    </View>
                )}

                {/* Enquiry Form */}
                <View style={{
                    backgroundColor: '#fff',
                    margin: 16,
                    padding: 20,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 20,
                    }}>
                        Personal Information
                    </Text>

                    {/* Name */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginBottom: 8,
                        }}>
                            Full Name <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: errors.name ? 'red' : '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                                backgroundColor: '#f9f9f9',
                            }}
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            placeholderTextColor="#999"
                        />
                        {errors.name && (
                            <Text style={{
                                color: 'red',
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                marginTop: 4,
                            }}>
                                {errors.name}
                            </Text>
                        )}
                    </View>

                    {/* Mobile */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginBottom: 8,
                        }}>
                            Mobile Number <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: errors.mobile ? 'red' : '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                                backgroundColor: '#f9f9f9',
                            }}
                            placeholder="Enter 10-digit mobile number"
                            value={formData.mobile}
                            onChangeText={(text) => handleInputChange('mobile', text)}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholderTextColor="#999"
                        />
                        {errors.mobile && (
                            <Text style={{
                                color: 'red',
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                marginTop: 4,
                            }}>
                                {errors.mobile}
                            </Text>
                        )}
                    </View>

                    {/* Email */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginBottom: 8,
                        }}>
                            Email Address <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: errors.email ? 'red' : '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                                backgroundColor: '#f9f9f9',
                            }}
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                        {errors.email && (
                            <Text style={{
                                color: 'red',
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                marginTop: 4,
                            }}>
                                {errors.email}
                            </Text>
                        )}
                    </View>

                    {/* Address */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginBottom: 8,
                        }}>
                            Address <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: errors.address ? 'red' : '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                                backgroundColor: '#f9f9f9',
                                minHeight: 80,
                            }}
                            placeholder="Enter your complete address"
                            value={formData.address}
                            onChangeText={(text) => handleInputChange('address', text)}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                        {errors.address && (
                            <Text style={{
                                color: 'red',
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                marginTop: 4,
                            }}>
                                {errors.address}
                            </Text>
                        )}
                    </View>



                    {/* Remarks */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginBottom: 8,
                        }}>
                            Remarks (Optional)
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                fontSize: 16,
                                fontFamily: 'Inter-Regular',
                                color: colors.TextColorBlack,
                                backgroundColor: '#f9f9f9',
                                minHeight: 100,
                            }}
                            placeholder="Any additional information or questions..."
                            value={formData.remark}
                            onChangeText={(text) => handleInputChange('remark', text)}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: loading ? '#ccc' : colors.AppColor,
                            padding: 16,
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 10,
                        }}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="send" size={18} color="#fff" />
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    color: '#fff',
                                }}>
                                    Submit Enquiry
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default CustomerEnquiry;