import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

const Header = ({
    title,
    onBackPress,
    showBackButton = true,
    rightComponent,
    style = {}
}) => {
    return (
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',


        }, style]}>
            {/* Back Button */}
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',

            }}>
                {showBackButton && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        style={{
                            padding: 3,
                            borderRadius: 8,
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.TextColorBlack} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    fontSize: 20,
                    fontFamily: 'Inter-Bold',
                    color: colors.TextColorBlack,
                    textAlign: 'center',
                }}>
                    {title}
                </Text>
            </View>

            {/* Right Section - Right Component */}
            <View style={{
                flex: 1,
                alignItems: 'flex-end',
            }}>
                {rightComponent && (
                    <View>
                        {rightComponent}
                    </View>
                )}
            </View>
        </View>
    );
};

export default Header;