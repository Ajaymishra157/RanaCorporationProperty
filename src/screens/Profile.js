import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/Colors';
import Header from '../components/Header';
import LogoutModal from '../components/LogoutModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConstant from '../constants/ApiConstant';
import Bottomtab from '../components/Bottomtab';

const Profile = () => {
    const navigation = useNavigation();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const [ProfileData, setProfileData] = useState([]);
    console.log("profiledata", ProfileData);


    // User data
    const userData = {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 9876543210',
        memberSince: 'January 2024',
        totalProperties: 12,
        activeLeads: 8,
        completedDeals: 25,
        rating: 4.8,
    };
    const ProfileDataApi = async () => {


        try {
            const Id = await AsyncStorage.getItem('id');

            if (!Id) {
                return;
            }
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Id
                }),
            });

            const result = await response.json();
            if (result.code === 200 && Array.isArray(result.payload) && result.payload.length > 0) {
                const data = result.payload[0];
                setProfileData(data);

            } else {
                console.log('Error:', result.message || 'Failed to load staff data');
            }
        } catch (error) {
            console.log('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        ProfileDataApi();

    }, []);

    const menuItems = [
        {
            id: 1,
            title: 'My Properties',
            icon: 'business-outline',
            color: '#4CAF50',
            onPress: () => navigation.navigate('PropertyListing')
        },
        {
            id: 2,
            title: 'My Leads',
            icon: 'people-outline',
            color: '#2196F3',
            onPress: () => navigation.navigate('MyLeads')
        },
        {
            id: 3,
            title: 'Favorites',
            icon: 'heart-outline',
            color: '#FF9800',
            onPress: () => navigation.navigate('Favorites')
        },
        {
            id: 4,
            title: 'Settings',
            icon: 'settings-outline',
            color: '#9C27B0',
            onPress: () => navigation.navigate('Settings')
        },
        {
            id: 5,
            title: 'Help & Support',
            icon: 'help-circle-outline',
            color: '#607D8B',
            onPress: () => navigation.navigate('HelpSupport')
        },
        {
            id: 6,
            title: 'About Us',
            icon: 'information-circle-outline',
            color: '#795548',
            onPress: () => navigation.navigate('AboutUs')
        },
        {
            id: 7,
            title: 'Ratings & Reviews',
            icon: 'star-outline',
            color: '#FFC107',
            onPress: () => navigation.navigate('RatingsReviews')
        },

    ];

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        try {
            console.log('User logged out');
            // Clear stored ID or all user data
            await AsyncStorage.removeItem('id');
            await AsyncStorage.clear(); // optional: clears all keys if you store multiple

            setLogoutModalVisible(false);

            // Navigate to login screen and reset stack
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            });
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    const cancelLogout = () => {
        setLogoutModalVisible(false);
    };


    // const handleLogout = () => {
    //     Alert.alert(
    //         'Logout',
    //         'Are you sure you want to logout?',
    //         [
    //             {
    //                 text: 'Cancel',
    //                 style: 'cancel'
    //             },
    //             {
    //                 text: 'Logout',
    //                 onPress: () => {
    //                     console.log('User logged out');
    //                     navigation.navigate('LoginScreen');
    //                 },
    //                 style: 'destructive'
    //             }
    //         ]
    //     );
    // };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Header
                    title="Profile"
                    showBackButton={false}
                />

                {/* Profile Header */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                }}>
                    {/* Profile Image */}
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: colors.AppColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 15,
                        position: 'relative',
                    }}>
                        <Text style={{
                            fontSize: 36,
                            fontFamily: 'Inter-Bold',
                            color: '#fff',
                        }}>
                            {ProfileData?.staff_name ? ProfileData.staff_name.charAt(0) : 'U'}
                        </Text>

                        {/* Edit Icon */}
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: colors.AppColor,
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: '#fff',
                            }}
                            onPress={handleEditProfile}
                        >
                            <Ionicons name="camera" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* User Info */}
                    <Text style={{
                        fontSize: 24,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 5,
                    }}>
                        {ProfileData.staff_name || '---'}
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        marginBottom: 15,
                    }}>
                        {userData.email}
                    </Text>

                    {/* Rating */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFF3E0',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        marginBottom: 15,
                    }}>
                        <Ionicons name="star" size={16} color="#FF9800" />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: '#FF9800',
                            marginLeft: 4,
                        }}>
                            {userData.rating} Rating
                        </Text>
                    </View>

                    {/* Edit Profile Button */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.AppColor,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                        }}
                        onPress={handleEditProfile}
                    >
                        <Ionicons name="create-outline" size={18} color="#fff" />
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: '#fff',
                            marginLeft: 8,
                        }}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Section */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Performance Stats
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: 'Inter-Bold',
                                color: colors.AppColor,
                            }}>
                                {userData.totalProperties}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                textAlign: 'center',
                            }}>
                                Properties
                            </Text>
                        </View>

                        <View style={{
                            width: 1,
                            backgroundColor: '#f0f0f0',
                            marginHorizontal: 10,
                        }} />

                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: 'Inter-Bold',
                                color: '#4CAF50',
                            }}>
                                {userData.activeLeads}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                textAlign: 'center',
                            }}>
                                Active Leads
                            </Text>
                        </View>

                        <View style={{
                            width: 1,
                            backgroundColor: '#f0f0f0',
                            marginHorizontal: 10,
                        }} />

                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: 'Inter-Bold',
                                color: '#FF9800',
                            }}>
                                {userData.completedDeals}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                textAlign: 'center',
                            }}>
                                Deals Closed
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={{
                    backgroundColor: '#fff',
                    marginTop: 10,
                    paddingVertical: 10,
                }}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 15,
                                paddingHorizontal: 20,
                                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                                borderBottomColor: '#f0f0f0',
                            }}
                            onPress={item.onPress}
                        >
                            <View style={{
                                backgroundColor: item.color + '20',
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 15,
                            }}>
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>

                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                flex: 1,
                            }}>
                                {item.title}
                            </Text>

                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional Info */}
                <View style={{
                    backgroundColor: '#fff',
                    marginTop: 10,
                    padding: 20,
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 10,
                    }}>
                        Account Information
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Phone Number
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                            {ProfileData.whatsapp_number}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Member Since
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                            {userData.memberSince}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#666',
                        }}>
                            Account Type
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.TextColorBlack,
                        }}>
                            {ProfileData.user_type}
                        </Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#fff',
                        marginTop: 10,
                        marginHorizontal: 10,
                        padding: 15,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#FF3B30',
                    }}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: '#FF3B30',
                        marginLeft: 10,
                    }}>
                        Logout
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
            </ScrollView>
            <LogoutModal
                visible={logoutModalVisible}
                onClose={cancelLogout}
                onConfirm={confirmLogout}
            />
            <Bottomtab />
        </SafeAreaView>
    );
};

export default Profile;