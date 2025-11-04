import { View, Text, TouchableOpacity, Modal } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

const LogoutModal = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                paddingHorizontal: 20,
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    width: '100%',
                    maxWidth: 320,
                    alignItems: 'center',
                }}>

                    {/* Warning Icon */}
                    <View style={{
                        backgroundColor: '#FFF3E0',
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>
                        <Ionicons name="log-out-outline" size={30} color="#FF9800" />
                    </View>

                    {/* Title */}
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 8,
                        textAlign: 'center',
                    }}>
                        Logout
                    </Text>

                    {/* Message */}
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                        color: '#666',
                        textAlign: 'center',
                        marginBottom: 24,
                        lineHeight: 20,
                    }}>
                        Are you sure you want to logout?
                    </Text>

                    {/* Buttons */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                marginRight: 8,
                                alignItems: 'center',
                            }}
                            onPress={onClose}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                            }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Logout Button */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#FF3B30',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                marginLeft: 8,
                                alignItems: 'center',
                            }}
                            onPress={onConfirm}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorWhite,
                            }}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LogoutModal;