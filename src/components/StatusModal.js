import React from 'react';
import {
    Modal,
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

const StatusModal = ({
    visible = false,
    onClose,
    onStatusChange,
    position = { top: 0, left: 0 },
    selectedLead = null
}) => {
    if (!visible) return null;

    const statusOptions = [
        { label: 'Approve', value: 'Approve', color: '#2e7d32' },
        { label: 'Reject', value: 'Reject', color: '#c62828' },
        { label: 'Pending', value: 'Pending', color: '#ef6c00' }
    ];

    const handleStatusSelect = (status) => {
        if (onStatusChange) {
            onStatusChange(status);
        }
    };

    // ✅ Current lead ka status get karo
    const currentStatus = selectedLead?.status;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Background Overlay */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Modal Content - Position based on touch */}
                <View style={[
                    styles.modalContainer,
                    {
                        top: position.top,
                        left: position.left
                    }
                ]}>
                    <Text style={styles.modalTitle}>
                        Update Status
                    </Text>

                    {/* Current Lead Info */}
                    {selectedLead && (
                        <View style={styles.leadInfo}>
                            <Text style={styles.leadName}>
                                {selectedLead.name || 'No Name'}
                            </Text>
                            <Text style={styles.leadId}>
                                ID: {selectedLead.enquiry_id}
                            </Text>
                        </View>
                    )}

                    {/* Status Options with Tick Mark */}
                    <View style={styles.optionsContainer}>
                        {statusOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    currentStatus === option.value && styles.selectedOption
                                ]}
                                onPress={() => handleStatusSelect(option.value)}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[
                                        styles.statusIndicator,
                                        { backgroundColor: option.color }
                                    ]} />
                                    <Text style={styles.optionText}>
                                        {option.label}
                                    </Text>
                                </View>

                                {/* ✅ TICK MARK - Agar current status hai to dikhao */}
                                {currentStatus === option.value && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={colors.AppColor}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: colors.TextColorWhite,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 200,
        maxWidth: 250,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: colors.TextColorBlack,
        marginBottom: 12,
    },
    leadInfo: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    leadName: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: colors.TextColorBlack,
        marginBottom: 2,
    },
    leadId: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: colors.Grey,
    },
    optionsContainer: {
        gap: 4,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    selectedOption: {
        backgroundColor: '#f0f8ff',
        borderWidth: 1,
        borderColor: colors.AppColor,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: colors.TextColorBlack,
        flex: 1,
    },
});

export default StatusModal;