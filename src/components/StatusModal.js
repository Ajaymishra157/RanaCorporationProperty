import React, { useState } from 'react';
import {
    Modal,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
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
    // ✅ States for both modals
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const statusOptions = [
        { label: 'Approve', value: 'Approve', color: '#2e7d32', icon: 'checkmark-circle' },
        { label: 'Reject', value: 'Reject', color: '#c62828', icon: 'close-circle' },
        { label: 'Pending', value: 'Pending', color: '#ef6c00', icon: 'time' }
    ];

    const handleStatusSelect = (status) => {
        // ✅ Store status and show confirmation
        setSelectedStatus(status);
        setShowConfirmation(true);
    };

    const handleConfirmStatusChange = () => {
        // ✅ Confirm status change
        if (onStatusChange) {
            onStatusChange(selectedStatus);
        }
        setShowConfirmation(false);
        setSelectedStatus('');
        onClose(); // ✅ Close both modals
    };

    const handleCloseConfirmation = () => {
        // ✅ Cancel confirmation
        setShowConfirmation(false);
        setSelectedStatus('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approve': return '#2e7d32';
            case 'Reject': return '#c62828';
            case 'Pending': return '#ef6c00';
            default: return colors.AppColor;
        }
    };

    const currentStatus = selectedLead?.status;

    return (
        <>
            {/* ✅ MAIN STATUS MODAL */}
            <Modal
                visible={visible && !showConfirmation}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={[
                        styles.modalContainer,
                        {
                            top: position.top,
                            left: position.left
                        }
                    ]}>
                        <Text style={styles.modalTitle}>Update Status</Text>

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
                                        <View
                                            style={[
                                                styles.statusIndicator,
                                                { backgroundColor: option.color }
                                            ]}
                                        />
                                        <Text style={styles.optionText}>
                                            {option.label}
                                        </Text>
                                    </View>

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

            {/* ✅ CONFIRMATION MODAL - SAME COMPONENT */}
            <Modal
                visible={showConfirmation}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseConfirmation}
            >
                <View style={styles.confirmationOverlay}>
                    <View style={styles.confirmationContainer}>
                        {/* Header */}
                        <View style={styles.confirmationHeader}>
                            <Ionicons
                                name="warning"
                                size={24}
                                color="#ff9800"
                            />
                            <Text style={styles.confirmationTitle}>
                                Confirm Status Change
                            </Text>
                        </View>

                        {/* Lead Info */}
                        <View style={styles.leadInfoSection}>
                            <Text style={styles.leadInfoText}>
                                Lead: <Text style={styles.leadName}>{selectedLead?.name || 'Unknown Lead'}</Text>
                            </Text>

                        </View>

                        {/* Status Change Info */}
                        {/* <View style={styles.statusChangeSection}>
                            <View style={styles.statusIndicator}>
                                <Ionicons
                                    name={statusOptions.find(opt => opt.value === selectedStatus)?.icon || 'help-circle'}
                                    size={20}
                                    color={getStatusColor(selectedStatus)}
                                />
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(selectedStatus) }
                                ]}>
                                    Change to: {selectedStatus}
                                </Text>
                            </View>
                        </View> */}

                        {/* Message */}
                        <Text style={styles.confirmationMessage}>
                            Are you sure you want to update the status?
                        </Text>

                        {/* Buttons */}
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCloseConfirmation}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleConfirmStatusChange}
                            >
                                <Ionicons name="checkmark" size={18} color="#fff" />
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // ✅ Original Modal Styles
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: colors.TextColorWhite,
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
        marginBottom: 5,
    },
    leadInfo: {
        marginBottom: 5,
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
        paddingVertical: 5,
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

    // ✅ Confirmation Modal Styles
    confirmationOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmationContainer: {
        backgroundColor: colors.TextColorWhite,
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    confirmationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    confirmationTitle: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: colors.TextColorBlack,
        marginLeft: 10,
    },
    leadInfoSection: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    leadInfoText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: colors.Grey,
        marginBottom: 4,
    },
    statusChangeSection: {
        marginBottom: 15,

    },
    statusText: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        marginLeft: 8,

    },
    confirmationMessage: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: colors.Grey,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    confirmButton: {
        backgroundColor: colors.AppColor,
    },
    cancelButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: colors.Grey,
    },
    confirmButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#fff',
    },
});

export default StatusModal;