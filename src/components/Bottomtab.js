import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/Colors';
import ApiConstant from '../constants/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTab = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const [activeTab, setActiveTab] = useState('Dashboard');

    const [userType, setUserType] = useState(null); // user_type from API


    // Fetch user type from API
    useEffect(() => {
        const fetchUserType = async () => {
            try {
                // User ID jo aapke sync/local storage se aayega
                const userId = await AsyncStorage.getItem('id'); // ya aapka state

                const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.user_type}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId }),
                });

                const data = await response.json();

                if (data.status) {
                    setUserType(data.type); // "Customer", "Admin", etc.
                }
            } catch (error) {
                console.log('Error fetching user type:', error);
            }
        };

        fetchUserType();
    }, []);



    const allTabs = [
        { name: 'Dashboard', icon: 'grid-view', type: 'MaterialIcons', screen: 'AgentDashboard' },
        { name: 'Home', icon: 'grid-view', type: 'MaterialIcons', screen: 'CustomerScreen' },
        { name: 'Properties', icon: 'home', type: 'Ionicons', screen: 'PropertyListing' },
        { name: 'Leads', icon: 'people', type: 'Ionicons', screen: 'ViewLeads' },
        { name: 'Profile', icon: 'person', type: 'Ionicons', screen: 'Profile' },
    ];
    const tabs = allTabs.filter(tab => {
        if (!userType) return true; // while loading, show all tabs
        if (userType === 'Customer') {
            return tab.name !== 'Dashboard' && tab.name !== 'Leads' && tab.name !== 'Properties';
        } else if (userType === 'Agent') {
            return tab.name !== 'Home';
        }
        return true;
    });

    useEffect(() => {
        const screenToTab = {
            AgentDashboard: 'Dashboard',
            PropertyListing: 'Properties',
            CustomerScreen: 'Home',
            ViewLeads: 'Leads',
            Profile: 'Profile',
            KYCVerification: 'Profile',
        };
        const tabName = screenToTab[route.name];
        if (tabName) setActiveTab(tabName);
    }, [route.name, isFocused]);

    const renderIcon = (tab) => {
        const color = activeTab === tab.name ? colors.AppColor : '#999';
        if (tab.type === 'MaterialIcons') return <MaterialIcons name={tab.icon} size={24} color={color} />;
        if (tab.type === 'Feather') return <Feather name={tab.icon} size={24} color={color} />;
        return <Ionicons name={tab.icon} size={24} color={color} />;
    };

    return (
        <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 5 }}>
            <View style={{ flexDirection: 'row', height: 60 }}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.name}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate(tab.screen)}
                    >
                        {renderIcon(tab)}
                        <Text style={{ fontSize: 12, color: activeTab === tab.name ? colors.AppColor : '#999', marginTop: 2 }}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default BottomTab;
