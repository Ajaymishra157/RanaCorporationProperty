// components/ConfirmationModal.js
import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import colors from '../constants/Colors';

const ConfirmationModal = ({
    visible,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "delete" // 'delete' or 'warning'
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 20
                }}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 24,
                            width: '100%',
                            maxWidth: 320,
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}>
                            {/* Title */}
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                                textAlign: 'center'
                            }}>
                                {title}
                            </Text>

                            {/* Message */}
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                marginBottom: 24,
                                textAlign: 'center',
                                lineHeight: 20
                            }}>
                                {message}
                            </Text>

                            {/* Buttons */}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 12
                            }}>
                                {/* Cancel Button */}
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#f8f9fa',
                                        paddingVertical: 12,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#dee2e6'
                                    }}
                                    onPress={onClose}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Medium',
                                        color: '#6c757d',
                                        textAlign: 'center'
                                    }}>
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>

                                {/* Confirm Button */}
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: type === 'delete' ? '#dc3545' : colors.AppColor,
                                        paddingVertical: 12,
                                        borderRadius: 8
                                    }}
                                    onPress={onConfirm}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: 'Inter-Medium',
                                        color: '#fff',
                                        textAlign: 'center'
                                    }}>
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ConfirmationModal;