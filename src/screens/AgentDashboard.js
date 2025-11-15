import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConstant from '../constants/ApiConstant';
import Bottomtab from '../components/Bottomtab';

const AgentDashboard = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [countData, setCountData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);
    const [showKYCLockScreen, setShowKYCLockScreen] = useState(false);

    useEffect(() => {
        const checkLoginName = async () => {
            try {
                const name = await AsyncStorage.getItem('staff_name');
                if (name) {
                    setUserName(name);
                }
            } catch (error) {
                console.log('Error checking login status:', error);
            }
        };
        checkLoginName();
    }, []);

    // KYC Status Check API
    const checkKYCStatus = async () => {
        try {
            const id = await AsyncStorage.getItem('id');
            if (!id) {
                console.log('❌ Staff ID not found');
                return;
            }

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.check_kyc}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_id: id
                })
            });

            const result = await response.json();

            if (result.code === 200 && result.payload) {
                setKycStatus(result.payload);
                // Agar KYC verified nahi hai to lock screen show karo
                if (result.payload.id_proof) {
                    setShowKYCLockScreen(false); // KYC verified hai - normal dashboard dikhao
                } else {
                    setShowKYCLockScreen(true); // KYC pending hai - lock screen dikhao
                }
            } else {
                console.log('❌ Error fetching KYC status:', result.message);
                setKycStatus({ id_proof: false });
                setShowKYCLockScreen(true); // Error mein bhi lock screen dikhao
            }
        } catch (error) {
            console.log('❌ Error checking KYC status:', error.message);
            setKycStatus({ id_proof: false });
            setShowKYCLockScreen(true); // Error mein bhi lock screen dikhao
        }
    };

    const ListCountApi = async (filters = {}) => {
        if (showKYCLockScreen) return; // Agar KYC locked hai to API call mat karo

        setLoading(true);
        try {
            const agent_id = await AsyncStorage.getItem('id');
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.count_view_property}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent_id: agent_id,

                }),
            });

            const result = await response.json();
            if (result.code == 200 && result.payload) {
                setCountData(result.payload);
                console.log("data aya kya");
            } else {
                setCountData([]);
                console.log('❌ Error: Failed to load data');
            }
        } catch (error) {
            console.log('❌ Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch data every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            checkKYCStatus();
            if (!showKYCLockScreen) {
                ListCountApi();
            }
        }, [showKYCLockScreen])
    );

    // KYC Lock Screen - Jab KYC verified nahi hai
    if (showKYCLockScreen) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 40,
                    backgroundColor: '#fff',
                }}>
                    {/* Lock Icon */}
                    <View style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: '#FFF3E0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 30,
                        borderWidth: 3,
                        borderColor: '#FF9800',
                    }}>
                        <Ionicons name="lock-closed" size={50} color="#FF9800" />
                    </View>

                    {/* Title */}
                    <Text style={{
                        fontSize: 28,
                        fontFamily: 'Inter-Bold',
                        color: '#333',
                        textAlign: 'center',
                        marginBottom: 16,
                    }}>
                        KYC Verification Required
                    </Text>

                    {/* Subtitle */}
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        textAlign: 'center',
                        marginBottom: 8,
                        lineHeight: 24,
                    }}>
                        Welcome to the app! To get started and access all features,
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-SemiBold',
                        color: '#FF9800',
                        textAlign: 'center',
                        marginBottom: 30,
                    }}>
                        please complete your KYC verification first.
                    </Text>

                    {/* Features that will be unlocked */}
                    <View style={{
                        backgroundColor: '#FFF9F2',
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 30,
                        width: '100%',
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Bold',
                            color: '#FF9800',
                            marginBottom: 12,
                            textAlign: 'center',
                            fontFamily: 'Inter-Medium'
                        }}>
                            🚀 Features Waiting for You
                        </Text>

                        <View style={{ marginLeft: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={{ marginLeft: 8, fontSize: 14, color: '#666', fontFamily: 'Inter-Regular' }}>Add Properties</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={{ marginLeft: 8, fontSize: 14, color: '#666', fontFamily: 'Inter-Regular' }}>View Leads & Enquiries</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={{ marginLeft: 8, fontSize: 14, color: '#666', fontFamily: 'Inter-Regular' }}>Access Dashboard Analytics</Text>
                            </View>
                        </View>
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.AppColor,
                            paddingVertical: 16,
                            paddingHorizontal: 40,
                            borderRadius: 12,
                            width: '100%',
                            alignItems: 'center',
                            shadowColor: colors.AppColor,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                        onPress={() => navigation.navigate('KYCVerification')}
                    >
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'Inter-Bold',
                            color: 'white',
                        }}>
                            Start KYC Verification
                        </Text>
                    </TouchableOpacity>

                    {/* Help Text */}
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: '#999',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>
                        This process usually takes 2-3 minutes
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ✅ Original Dashboard - Jab KYC verified hai
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: colors.AppColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Text style={{
                                color: '#fff',
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                            }}>
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </TouchableOpacity>

                        <View>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                            }}>
                                Good Morning,
                            </Text>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginTop: 2,
                            }}>
                                {userName || '---'}
                            </Text>
                            {/* KYC Verified Badge */}
                            {kycStatus?.id_proof && (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 4,
                                }}>
                                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                                    <Text style={{
                                        fontSize: 12,
                                        fontFamily: 'Inter-Medium',
                                        color: "#4CAF50",
                                        marginLeft: 4,
                                    }}>
                                        KYC Verified
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: '#f8f9fa',
                            position: 'relative',
                        }}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications-outline" size={24} color={colors.TextColorBlack} />
                        <View style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            backgroundColor: '#FF3B30',
                            borderRadius: 10,
                            width: 18,
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontFamily: 'Inter-Bold',
                            }}>
                                3
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={{ padding: 20 }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Overview
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                        {[
                            {
                                id: 1,
                                title: 'Total Views',
                                value: countData?.view_property_count || '0',
                                icon: 'eye-outline',
                                color: '#4CAF50',
                            },
                            {
                                id: 2,
                                title: 'Active Properties',
                                value: countData?.active_property_count || '0',
                                icon: 'business-outline',
                                color: '#2196F3',
                            },
                            {
                                id: 3,
                                title: 'Active Enquiries',
                                value: countData?.active_enquiry_count || '0',
                                icon: 'people-outline',
                                color: '#FF9800',
                            },
                        ].map((stat) => (
                            <View key={stat.id} style={{
                                backgroundColor: '#fff',
                                borderRadius: 12,
                                padding: 15,
                                width: '48%',
                                marginBottom: 15,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 3,
                            }}>
                                <View style={{
                                    backgroundColor: stat.color + '20',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                }}>
                                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                                </View>
                                <Text style={{
                                    fontSize: 20,
                                    fontFamily: 'Inter-Bold',
                                    color: colors.TextColorBlack,
                                    marginBottom: 4,
                                }}>
                                    {stat.value}
                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Inter-Medium',
                                    color: '#666',
                                    marginBottom: 4,
                                }}>
                                    {stat.title}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Quick Actions
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {[
                            {
                                id: 1,
                                title: 'Add Property',
                                icon: 'add-circle-outline',
                                color: '#4CAF50',
                                onPress: () => navigation.navigate('PropertyListing')
                            },
                            {
                                id: 2,
                                title: 'View Leads',
                                icon: 'people-outline',
                                color: '#2196F3',
                                onPress: () => navigation.navigate('ViewLeads')
                            },
                            {
                                id: 3,
                                title: 'Schedule',
                                icon: 'calendar-outline',
                                color: '#FF9800',
                                onPress: () => navigation.navigate('Schedule')
                            },
                            {
                                id: 4,
                                title: 'KYC',
                                icon: kycStatus?.id_proof ? 'shield-checkmark' : 'shield-checkmark-outline',
                                color: kycStatus?.id_proof ? '#FF5722' : '#FF5722', // Grey if verified
                                onPress: kycStatus?.id_proof
                                    ? () => { } // Empty function if verified - kuch nahi hoga
                                    : () => navigation.navigate('KYCVerification') // Navigate if not verified
                            },
                        ].map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    padding: 15,
                                    alignItems: 'center',
                                    width: '23%',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 3,
                                    opacity: action.id === 4 && kycStatus?.id_proof ? 0.6 : 1, // Faded if KYC verified
                                }}
                                onPress={action.onPress}
                                disabled={action.id === 4 && kycStatus?.id_proof} // Disable if KYC verified
                            >
                                <View style={{
                                    backgroundColor: action.color + '20',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}>
                                    <Ionicons name={action.icon} size={24} color={action.color} />
                                    {/* Green tick badge agar KYC verified hai */}
                                    {action.id === 4 && kycStatus?.id_proof && (
                                        <View style={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -5,
                                            backgroundColor: '#4CAF50',
                                            borderRadius: 10,
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                        }}>
                                            <Ionicons name="checkmark" size={12} color="#fff" />
                                        </View>
                                    )}
                                </View>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Inter-Medium',
                                    color: action.id === 4 && kycStatus?.id_proof ? '#999' : colors.TextColorBlack,
                                    textAlign: 'center',
                                }}>
                                    {action.title}
                                    {action.id === 4 && kycStatus?.id_proof && ' ✓'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Rest of your dashboard components... */}
                {/* Recent Activities */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    {/* ... existing code ... */}
                </View>

                {/* Performance Chart */}
                <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
                    {/* ... existing code ... */}
                </View>
            </ScrollView>
            <Bottomtab />
        </SafeAreaView>
    );
};

export default AgentDashboard;