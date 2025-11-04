import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import colors from '../constants/Colors';

const CustomAlert = ({
    visible,
    message,
    onClose,
}) => {
    const slideAnim = useRef(new Animated.Value(300)).current; // Start from bottom

    useEffect(() => {
        if (visible) {
            // Slide up animation
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Slide down animation
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
                <Animated.View style={{
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    padding: 20,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>

                    {/* Message */}
                    <Text style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: 'Inter-Medium',
                        color: colors.TextColorBlack,
                        marginRight: 10,
                        lineHeight: 22,
                    }}>
                        {message}
                    </Text>

                    {/* OK Button */}
                    <TouchableOpacity
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.AppColor,
                        }}
                        onPress={onClose}
                    >
                        <Text style={{
                            color: colors.TextColorWhite,
                            fontSize: 14,
                            fontFamily: 'Inter-Bold',
                        }}>
                            OK
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default CustomAlert;