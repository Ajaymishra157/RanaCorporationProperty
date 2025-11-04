import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

const FiltersModal = ({ visible, onClose, onApplyFilters, currentFilters }) => {
    const [filters, setFilters] = useState(currentFilters || {
        location: '',
        minPrice: '',
        maxPrice: '',
        propertyType: '',
        minArea: '',
        maxArea: '',
        bedrooms: '',
        bathrooms: '',
        amenities: []
    });

    // Available options
    const propertyTypes = ['Apartment', 'Villa', 'Flat', 'Penthouse', 'Commercial', 'Studio'];
    const bedroomOptions = ['1', '2', '3', '4', '5+'];
    const bathroomOptions = ['1', '2', '3', '4+'];
    const amenitiesList = [
        'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
        'Lift', 'Power Backup', 'Water Supply', 'Park', 'Club House'
    ];

    // Handle amenity selection
    const toggleAmenity = (amenity) => {
        const updatedAmenities = filters.amenities.includes(amenity)
            ? filters.amenities.filter(item => item !== amenity)
            : [...filters.amenities, amenity];

        setFilters({ ...filters, amenities: updatedAmenities });
    };

    // Handle apply filters
    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    // Handle reset filters
    const handleReset = () => {
        setFilters({
            location: '',
            minPrice: '',
            maxPrice: '',
            propertyType: '',
            minArea: '',
            maxArea: '',
            bedrooms: '',
            bathrooms: '',
            amenities: []
        });
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end',
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    maxHeight: '90%',
                    paddingBottom: 20,
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Inter-Bold',
                            color: colors.TextColorBlack,
                        }}>
                            Filters
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ padding: 8, marginRight: 10 }}
                                onPress={handleReset}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: 'Inter-Medium',
                                    color: colors.AppColor,
                                }}>
                                    Reset
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={colors.TextColorBlack} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>

                        {/* Location */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Location
                            </Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    paddingVertical: 12,
                                    fontSize: 14,
                                    fontFamily: 'Inter-Regular',
                                    color: colors.TextColorBlack,
                                }}
                                placeholder="Enter location..."
                                placeholderTextColor={colors.PlaceHolderTextcolor}
                                value={filters.location}
                                onChangeText={(text) => setFilters({ ...filters, location: text })}
                            />
                        </View>

                        {/* Budget Range */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Budget Range
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 12,
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        color: colors.TextColorBlack,
                                        width: '48%',
                                    }}
                                    placeholder="Min Price"
                                    placeholderTextColor={colors.PlaceHolderTextcolor}
                                    value={filters.minPrice}
                                    onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 12,
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        color: colors.TextColorBlack,
                                        width: '48%',
                                    }}
                                    placeholder="Max Price"
                                    placeholderTextColor={colors.PlaceHolderTextcolor}
                                    value={filters.maxPrice}
                                    onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Property Type */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Property Type
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {propertyTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            backgroundColor: filters.propertyType === type ? colors.AppColor : '#f8f9fa',
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: filters.propertyType === type ? colors.AppColor : '#ddd',
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilters({ ...filters, propertyType: type })}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: filters.propertyType === type ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Area Range */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Area Range (sq ft)
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 12,
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        color: colors.TextColorBlack,
                                        width: '48%',
                                    }}
                                    placeholder="Min Area"
                                    placeholderTextColor={colors.PlaceHolderTextcolor}
                                    value={filters.minArea}
                                    onChangeText={(text) => setFilters({ ...filters, minArea: text })}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 12,
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        color: colors.TextColorBlack,
                                        width: '48%',
                                    }}
                                    placeholder="Max Area"
                                    placeholderTextColor={colors.PlaceHolderTextcolor}
                                    value={filters.maxArea}
                                    onChangeText={(text) => setFilters({ ...filters, maxArea: text })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Bedrooms & Bathrooms */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Bedrooms & Bathrooms
                            </Text>

                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Bedrooms
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                                {bedroomOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={{
                                            backgroundColor: filters.bedrooms === option ? colors.AppColor : '#f8f9fa',
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: filters.bedrooms === option ? colors.AppColor : '#ddd',
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilters({ ...filters, bedrooms: option })}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: filters.bedrooms === option ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {option} {option === '5+' ? '' : 'Beds'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Medium',
                                color: colors.TextColorBlack,
                                marginBottom: 8,
                            }}>
                                Bathrooms
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {bathroomOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={{
                                            backgroundColor: filters.bathrooms === option ? colors.AppColor : '#f8f9fa',
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: filters.bathrooms === option ? colors.AppColor : '#ddd',
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => setFilters({ ...filters, bathrooms: option })}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: 'Inter-Medium',
                                            color: filters.bathrooms === option ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {option} {option === '4+' ? '' : 'Baths'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Amenities */}
                        <View style={{ marginBottom: 30 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: colors.TextColorBlack,
                                marginBottom: 10,
                            }}>
                                Amenities
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {amenitiesList.map((amenity) => (
                                    <TouchableOpacity
                                        key={amenity}
                                        style={{
                                            backgroundColor: filters.amenities.includes(amenity) ? colors.AppColor : '#f8f9fa',
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: filters.amenities.includes(amenity) ? colors.AppColor : '#ddd',
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => toggleAmenity(amenity)}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Medium',
                                            color: filters.amenities.includes(amenity) ? '#fff' : colors.TextColorBlack,
                                        }}>
                                            {amenity}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Apply Button */}
                    <View style={{ paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.AppColor,
                                paddingVertical: 16,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                            onPress={handleApply}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Inter-Bold',
                                color: '#fff',
                            }}>
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FiltersModal;