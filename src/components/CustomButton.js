import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../constants/Colors';

const CustomButton = ({
    title,
    onPress,
    variant = 'primary', // 'primary', 'secondary', 'danger'
    size = 'medium', // 'small', 'medium', 'large'
    disabled = false,
    style = {},
    textStyle = {}
}) => {

    // Button styles based on variant
    const getButtonStyle = () => {
        const baseStyle = {
            paddingVertical: size === 'small' ? 12 : size === 'large' ? 18 : 16,
            borderRadius: 8,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        };

        const variantStyles = {
            primary: {
                backgroundColor: disabled ? '#ccc' : colors.AppColor,
            },
            secondary: {
                backgroundColor: disabled ? '#ccc' : '#ff0000',
            },
            danger: {
                backgroundColor: disabled ? '#ccc' : '#dc3545',
            }
        };

        return { ...baseStyle, ...variantStyles[variant], ...style };
    };

    // Text styles based on variant
    const getTextStyle = () => {
        const baseStyle = {
            fontSize: size === 'small' ? 14 : size === 'large' ? 20 : 18,
            fontFamily: 'Inter-Bold',
            color: colors.TextColorWhite,
        };

        return { ...baseStyle, ...textStyle };
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={getTextStyle()}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;