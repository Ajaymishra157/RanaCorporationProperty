import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from '../screens/LoginScreen'
import Registration from '../screens/Registration'




const Stack = createNativeStackNavigator()


const RouteNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}  // Hide header for login
                />
                <Stack.Screen
                    name="Registration"
                    component={Registration}
                    options={{ headerShown: false }}  // Hide header for login
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RouteNavigation

const styles = StyleSheet.create({})