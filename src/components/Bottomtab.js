import { Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/Colors';

const Bottomtab = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const route = useRoute();
    const [activeTab, setActiveTab] = useState('Dashboard');

    useEffect(() => {
        if (isFocused) {
            const currentRoute = route.name;

            const routeToTabMap = {
                'AgentDashboard': 'Dashboard',
                'PropertyListing': 'Properties',
                'ViewLeads': 'Leads',
                'Profile': 'Profile',
                'KYCVerification': 'Profile'
            };

            if (routeToTabMap[currentRoute] && activeTab !== routeToTabMap[currentRoute]) {
                setActiveTab(routeToTabMap[currentRoute]);
            }
        }
    }, [isFocused, route]);

    const tabs = [
        {
            id: 1,
            name: 'Dashboard',
            icon: 'grid-view',
            iconType: 'MaterialIcons',
            screen: 'AgentDashboard'
        },
        {
            id: 2,
            name: 'Properties',
            icon: 'home',
            iconType: 'Ionicons',
            screen: 'PropertyListing'
        },
        {
            id: 3,
            name: 'Leads',
            icon: 'people',
            iconType: 'Ionicons',
            screen: 'ViewLeads'
        },
        {
            id: 4,
            name: 'Profile',
            icon: 'person',
            iconType: 'Ionicons',
            screen: 'Profile'
        }
    ];

    const handleTabPress = (tabName, screenName) => {
        if (activeTab !== tabName) {
            setActiveTab(tabName);
        }
        navigation.navigate(screenName);
    };

    const renderIcon = (icon, iconType, isActive) => {
        const iconColor = isActive ? colors.AppColor : '#999';
        const iconSize = 24;

        switch (iconType) {
            case 'MaterialIcons':
                return <MaterialIcons name={icon} size={iconSize} color={iconColor} />;
            case 'Feather':
                return <Feather name={icon} size={iconSize} color={iconColor} />;
            default:
                return <Ionicons name={icon} size={iconSize} color={iconColor} />;
        }
    };

    return (
        <View style={{
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 8,
        }}>
            <View style={{
                flexDirection: 'row',
                height: 70,
                paddingHorizontal: 10,
            }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.name;

                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 8,
                            }}
                            onPress={() => handleTabPress(tab.name, tab.screen)}
                        >
                            <View style={{
                                alignItems: 'center',
                                marginBottom: 4,
                                position: 'relative',
                            }}>
                                {renderIcon(tab.icon, tab.iconType, isActive)}
                                {isActive && <View style={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -5,
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: colors.AppColor,
                                }} />}
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium',
                                color: isActive ? colors.AppColor : '#999',
                                marginTop: 2,
                            }}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default Bottomtab;