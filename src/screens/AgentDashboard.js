import { SafeAreaView, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConstant from '../constants/ApiConstant';

const AgentDashboard = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [enquiryData, setEnquiryData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const checkLoginName = async () => {
            try {

                const name = await AsyncStorage.getItem('staff_name'); // 👈 new line


                if (name) {
                    setUserName(name); // 👈 store name in state
                }


            } catch (error) {
                console.log('Error checking login status:', error);
            }
        };

        checkLoginName();
    }, []);
    // Sample data
    const statsData = [
        { id: 1, title: 'Total Views', value: '2.5K', icon: 'eye-outline', color: '#4CAF50', change: '+12%' },
        { id: 2, title: 'Active Leads', value: '48', icon: 'people-outline', color: '#2196F3', change: '+5%' },
        { id: 3, title: 'Properties', value: '12', icon: 'business-outline', color: '#FF9800', change: '+2' },
        { id: 4, title: 'Revenue', value: '₹85K', icon: 'trending-up-outline', color: '#9C27B0', change: '+18%' },
    ];

    const recentActivities = [
        { id: 1, type: 'New Lead', property: '3BHK Apartment', time: '2 hours ago', icon: 'person-add' },
        { id: 2, type: 'Property Viewed', property: 'Villa in Sector 15', time: '5 hours ago', icon: 'eye' },
        { id: 3, type: 'Meeting Scheduled', property: 'Commercial Space', time: '1 day ago', icon: 'calendar' },
        { id: 4, type: 'Deal Closed', property: '2BHK Flat', time: '2 days ago', icon: 'checkmark-done' },
    ];

    const quickActions = [
        {
            id: 1,
            title: 'Add Property',
            icon: 'add-circle-outline',
            color: '#4CAF50',
            onPress: () => navigation.navigate('PropertyListing')
        },
        { id: 2, title: 'View Leads', icon: 'people-outline', color: '#2196F3', onPress: () => navigation.navigate('Profile') },
        { id: 3, title: 'Schedule', icon: 'calendar-outline', color: '#FF9800' },
        // { id: 4, title: 'Analytics', icon: 'bar-chart-outline', color: '#9C27B0' },
        {
            id: 4,
            title: 'KYC Verification',
            icon: 'shield-checkmark-outline',
            color: '#FF5722',
            onPress: () => navigation.navigate('KYCVerification')
        },
    ];


    const ListEnquiryApi = async (filters = {}) => {
        setLoading(true);

        try {
            console.log('📡 API Request:', filters);

            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_enquiry}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();


            if (result.code === 200 && result.payload) {
                setEnquiryData(result.payload);
            } else {
                setEnquiryData([]);
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
            ListEnquiryApi(); // call your API
        }, [])
    );



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
                    {/* Left Side - Greeting and User Icon */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {/* User Icon */}
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

                        {/* Greeting Text */}
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
                        </View>
                    </View>

                    {/* Right Side - Notification Icon */}
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
                <View style={{
                    padding: 20,
                }}>
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
                        {statsData.map((stat) => (
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
                                <Text style={{
                                    fontSize: 11,
                                    fontFamily: 'Inter-Bold',
                                    color: stat.color,
                                }}>
                                    {stat.change}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{
                    paddingHorizontal: 20,
                    marginBottom: 20,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Quick Actions
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        {quickActions.map((action) => (
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
                                }}
                                onPress={action.onPress} // ✅ Add Property par click karega
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
                                </View>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.TextColorBlack,
                                    textAlign: 'center',
                                }}>
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activities */}
                <View style={{
                    paddingHorizontal: 20,
                    marginBottom: 20,
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
                            color: colors.TextColorBlack,
                        }}>
                            Recent Activities
                        </Text>
                        <TouchableOpacity>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.AppColor,
                            }}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3,
                    }}>
                        {recentActivities.map((activity, index) => (
                            <View key={activity.id} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                borderBottomWidth: index === recentActivities.length - 1 ? 0 : 1,
                                borderBottomColor: '#f0f0f0',
                            }}>
                                <View style={{
                                    backgroundColor: colors.AppColor + '20',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 12,
                                }}>
                                    <Ionicons name={activity.icon} size={20} color={colors.AppColor} />
                                </View>
                                <View style={{
                                    flex: 1,
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontFamily: 'Inter-Medium',
                                        color: colors.TextColorBlack,
                                        marginBottom: 2,
                                    }}>
                                        {activity.type}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        fontFamily: 'Inter-Regular',
                                        color: '#666',
                                    }}>
                                        {activity.property}
                                    </Text>
                                </View>
                                <Text style={{
                                    fontSize: 11,
                                    fontFamily: 'Inter-Regular',
                                    color: '#999',
                                }}>
                                    {activity.time}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Performance Chart */}
                <View style={{
                    paddingHorizontal: 20,
                    marginBottom: 30,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Performance
                    </Text>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3,
                    }}>
                        <Ionicons name="bar-chart" size={40} color="#ccc" />
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                            marginTop: 10,
                            marginBottom: 5,
                        }}>
                            Monthly Performance Chart
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                            textAlign: 'center',
                        }}>
                            Views, Leads & Conversions
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AgentDashboard;