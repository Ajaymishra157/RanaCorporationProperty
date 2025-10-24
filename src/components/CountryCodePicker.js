import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
];

const CountryCodePicker = ({ selectedCode, onSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (code) => {
        onSelect(code);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.countryCodeText}>{selectedCode}</Text>
                <Ionicons name="chevron-down" size={16} color="#888" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country Code</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={countryCodes}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        selectedCode === item.code && styles.selectedCountryItem
                                    ]}
                                    onPress={() => handleSelect(item.code)}
                                >
                                    <Text style={styles.flagText}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    <Text style={styles.countryCode}>{item.code}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: colors.TextColorBlack,
        marginRight: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: colors.TextColorBlack,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedCountryItem: {
        backgroundColor: '#f0f8ff',
    },
    flagText: {
        fontSize: 20,
        marginRight: 12,
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: colors.TextColorBlack,
    },
    countryCode: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#666',
    },
});

export default CountryCodePicker;