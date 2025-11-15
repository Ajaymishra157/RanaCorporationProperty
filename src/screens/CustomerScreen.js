import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import BottomTab from '../components/Bottomtab'
import { useNavigation } from '@react-navigation/native'

const CustomerScreen = () => {
    const navigation = useNavigation();
    // Static data for demo
    const userData = {
        name: "Rahul Sharma",
        savedProperties: 12,
        enquiries: 5,
        scheduledVisits: 3
    }

    const recentProperties = [
        {
            id: 1,
            title: "Luxury 3BHK Apartment",
            price: "2.5 Cr",
            location: "Bandra West, Mumbai",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
            bedrooms: 3,
            bathrooms: 2,
            area: "1500"
        },
        {
            id: 2,
            title: "Modern 2BHK Flat",
            price: "85 Lakhs",
            location: "Whitefield, Bangalore",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
            bedrooms: 2,
            bathrooms: 2,
            area: "1100"
        }
    ]

    const recommendedProperties = [
        {
            id: 1,
            title: "Affordable 1BHK",
            price: "45 Lakhs",
            location: "Kharadi, Pune",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
        },
        {
            id: 2,
            title: "Villa with Garden",
            price: "3.8 Cr",
            location: "Gurgaon Sector 54",
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400"
        }
    ]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Header Section */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 15,
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',

            }}>
                <View style={{ flexDirection: 'row', flexDirection: 'row', }}>
                    <View style={{
                        width: 45,
                        height: 45,
                        borderRadius: 22.5,
                        backgroundColor: '#007AFF',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                        shadowColor: '#007AFF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,

                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>
                            {userData.name.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: 14,
                            color: '#666',
                        }}>
                            Good Morning,
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            {userData.name}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 8,
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: '#4CAF50',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        shadowColor: '#4CAF50',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,

                        backgroundGradient: {
                            colors: ['#E8F5E9', '#FFFFFF'],
                            start: { x: 0, y: 0 },
                            end: { x: 1, y: 1 }
                        }

                    }}
                    onPress={() => navigation.navigate('PostProperty')}
                >
                    <Ionicons name="add-circle" size={18} color="#4CAF50" />
                    <Text style={{
                        color: '#4CAF50',
                        fontSize: 12,
                        fontWeight: '700',
                        letterSpacing: 0.5,
                    }}>
                        Post Property
                    </Text>
                </TouchableOpacity>


            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                {/* Search Bar */}
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    margin: 20,
                    padding: 15,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <Text style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: '#666',
                    }}>
                        Search properties, locations...
                    </Text>
                </TouchableOpacity>

                {/* Stats Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: 15,
                    }}>
                        My Activity
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '31%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#FFE6E6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="heart-outline" size={24} color="#FF3B30" />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: 4,
                            }}>
                                {userData.savedProperties}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontWeight: '600',
                            }}>
                                Saved
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '31%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#E6F3FF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: 4,
                            }}>
                                {userData.enquiries}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontWeight: '600',
                            }}>
                                Enquiries
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '31%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#E6F7EE',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="calendar-outline" size={24} color="#34C759" />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: 4,
                            }}>
                                {userData.scheduledVisits}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontWeight: '600',
                            }}>
                                Visits
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: 15,
                    }}>
                        Quick Actions
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '23%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#FFF0E6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="home-outline" size={24} color="#FF6B35" />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center',
                            }}>
                                Browse
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '23%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#F0E6FF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="filter-outline" size={24} color="#5856D6" />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center',
                            }}>
                                Filters
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '23%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#E6FFEE',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="trending-up-outline" size={24} color="#34C759" />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center',
                            }}>
                                Price Alert
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            width: '23%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#FFE6F5',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Ionicons name="headset-outline" size={24} color="#FF2D55" />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center',
                            }}>
                                Support
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recently Viewed */}
                <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            Recently Viewed
                        </Text>
                        <TouchableOpacity>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#007AFF',
                            }}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                        {recentProperties.map(property => (
                            <TouchableOpacity key={property.id} style={{
                                backgroundColor: '#fff',
                                borderRadius: 12,
                                marginRight: 15,
                                width: 280,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 3,
                                overflow: 'hidden',
                            }}>
                                <Image
                                    source={{ uri: property.image }}
                                    style={{
                                        width: '100%',
                                        height: 160,
                                        resizeMode: 'cover',
                                    }}
                                />
                                <View style={{ padding: 15 }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333',
                                        marginBottom: 5,
                                    }}>
                                        ₹{property.price}
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: 5,
                                    }} numberOfLines={1}>
                                        {property.title}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                        <Ionicons name="location-outline" size={12} color="#666" />
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#666',
                                            marginLeft: 4,
                                        }} numberOfLines={1}>
                                            {property.location}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 12, color: '#666' }}>{property.bedrooms} Beds</Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>{property.bathrooms} Baths</Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>{property.area} sq ft</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Recommended For You */}
                <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            Recommended For You
                        </Text>
                        <TouchableOpacity>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#007AFF',
                            }}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {recommendedProperties.map(property => (
                            <TouchableOpacity key={property.id} style={{
                                backgroundColor: '#fff',
                                borderRadius: 12,
                                width: '48%',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 3,
                                overflow: 'hidden',
                            }}>
                                <Image
                                    source={{ uri: property.image }}
                                    style={{
                                        width: '100%',
                                        height: 120,
                                        resizeMode: 'cover',
                                    }}
                                />
                                <View style={{ padding: 12 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#333',
                                        marginBottom: 4,
                                    }}>
                                        ₹{property.price}
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: 4,
                                    }} numberOfLines={1}>
                                        {property.title}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="location-outline" size={10} color="#666" />
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#666',
                                            marginLeft: 4,
                                        }} numberOfLines={1}>
                                            {property.location}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Premium Banner */}
                <View style={{
                    backgroundColor: '#007AFF',
                    margin: 20,
                    borderRadius: 16,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginBottom: 5,
                        }}>
                            Premium Properties
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#E6F3FF',
                            marginBottom: 15,
                        }}>
                            Exclusive deals for premium buyers
                        </Text>
                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 20,
                            alignSelf: 'flex-start',
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#007AFF',
                            }}>
                                Explore Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="sparkles" size={30} color="#FFD700" />
                    </View>
                </View>
            </ScrollView>
            <BottomTab />
        </SafeAreaView>
    )
}

export default CustomerScreen

const styles = StyleSheet.create({})