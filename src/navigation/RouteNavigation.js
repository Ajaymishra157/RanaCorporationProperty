import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from '../screens/LoginScreen'
import Registration from '../screens/Registration'
import AgentDashboard from '../screens/AgentDashboard'
import AgentAddProperty from '../screens/AgentAddProperty'
import Profile from '../screens/Profile'
import RatingsReviews from '../screens/RatingsReviews'
import PropertyListing from '../screens/PropertyListing'
import PropertyDetail from '../screens/PropertyDetail'
import Favorites from '../screens/Favorites'
import AsyncStorage from '@react-native-async-storage/async-storage'
import colors from '../constants/Colors'
import KYCVerification from '../screens/KYCVerification'
import ViewLeads from '../screens/ViewLeads'

const Stack = createNativeStackNavigator()

const RouteNavigation = () => {

    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const id = await AsyncStorage.getItem('id');


            if (id) {
                setInitialRoute('AgentDashboard');
            } else {
                setInitialRoute('LoginScreen');
            }
        };

        checkLoginStatus();
    }, []);

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.AppColor} />
            </View>
        );
    }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Registration"
                    component={Registration}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AgentDashboard"
                    component={AgentDashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AgentAddProperty"
                    component={AgentAddProperty}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RatingsReviews"
                    component={RatingsReviews}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PropertyListing"
                    component={PropertyListing}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PropertyDetail"
                    component={PropertyDetail}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Favorites"
                    component={Favorites}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="KYCVerification"
                    component={KYCVerification}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ViewLeads"
                    component={ViewLeads}
                    options={{ headerShown: false }}
                />









            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RouteNavigation

const styles = StyleSheet.create({})