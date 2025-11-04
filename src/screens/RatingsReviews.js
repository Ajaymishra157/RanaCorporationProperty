import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colors from '../constants/Colors';
import Header from '../components/Header';
import ApiConstant from '../constants/ApiConstant';

const RatingsReviews = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState([]);

    // Calculate overall stats from API data
    const calculateOverallStats = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }

        // Since API doesn't provide ratings, we'll generate random ratings for demo
        // In real scenario, ratings should come from API
        const ratings = reviews.map(() => Math.floor(Math.random() * 5) + 1);

        const totalReviews = reviews.length;
        const averageRating = (ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews).toFixed(1);

        const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratings.forEach(rating => {
            ratingBreakdown[rating]++;
        });

        return {
            averageRating: parseFloat(averageRating),
            totalReviews,
            ratingBreakdown
        };
    };

    // Format date to relative time (e.g., "2 days ago")
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    };

    // Generate random likes count for demo
    const generateRandomLikes = () => Math.floor(Math.random() * 20) + 1;

    // Generate random isLiked for demo
    const generateRandomIsLiked = () => Math.random() > 0.5;

    // Generate random property names for demo
    const generateRandomProperty = () => {
        const properties = [
            '3BHK Apartment, Sector 15',
            '2BHK Flat, Golf Course Road',
            'Villa in DLF Phase 2',
            'Studio Apartment, Sector 56',
            '4BHK Penthouse, Sector 42',
            'Commercial Space, MG Road',
            'Plot in Sector 22',
            '1BHK Flat, Sohna Road'
        ];
        return properties[Math.floor(Math.random() * properties.length)];
    };

    // API call to fetch reviews
    const RatingReviewsApi = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${ApiConstant.URL}${ApiConstant.OtherURL.list_review}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.code === 200 && result.payload) {
                setReviewData(result.payload);
            } else {
                setReviewData([]);
                console.log('❌ Error: Failed to load review data');
            }
        } catch (error) {
            console.log('❌ Error fetching review data:', error.message);
            setReviewData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            RatingReviewsApi();
        }, [])
    );

    // Calculate overall stats
    const overallStats = calculateOverallStats(reviewData);

    // Calculate percentage for each rating
    const calculatePercentage = (count) => {
        return overallStats.totalReviews > 0 ? (count / overallStats.totalReviews) * 100 : 0;
    };

    // Render star rating
    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={16}
                        color={star <= rating ? "#FFD700" : "#ccc"}
                        style={{ marginRight: 2 }}
                    />
                ))}
            </View>
        );
    };

    // Render rating breakdown bar
    const renderRatingBar = (stars, count) => {
        const percentage = calculatePercentage(count);
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Inter-Medium', color: colors.TextColorBlack, width: 20 }}>
                    {stars}
                </Text>
                <Ionicons name="star" size={14} color="#FFD700" style={{ marginHorizontal: 5 }} />
                <View style={{ flex: 1, height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginHorizontal: 10 }}>
                    <View style={{
                        width: `${percentage}%`,
                        height: 6,
                        backgroundColor: '#FFD700',
                        borderRadius: 3
                    }} />
                </View>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: '#666', width: 30 }}>
                    {count}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                <Header
                    title="Ratings & Reviews"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.AppColor} />
                    <Text style={{ marginTop: 10, fontFamily: 'Inter-Regular', color: '#666' }}>
                        Loading reviews...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                {/* Header */}
                <Header
                    title="Ratings & Reviews"
                    onBackPress={() => navigation.goBack()}
                />

                {/* Overall Rating Card */}
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    margin: 10,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                        marginBottom: 15,
                    }}>
                        Overall Rating
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <View style={{
                            backgroundColor: overallStats.totalReviews > 0 ? '#4CAF50' : '#ccc',
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 20,
                        }}>
                            <Text style={{
                                fontSize: 24,
                                fontFamily: 'Inter-Bold',
                                color: '#fff',
                            }}>
                                {overallStats.averageRating}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name="star"
                                        size={8}
                                        color="#fff"
                                        style={{ marginRight: 1 }}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                color: '#666',
                                marginBottom: 5,
                            }}>
                                Based on {overallStats.totalReviews} reviews
                            </Text>

                            {/* Rating Breakdown */}
                            {[5, 4, 3, 2, 1].map((rating) => (
                                renderRatingBar(rating, overallStats.ratingBreakdown[rating])
                            ))}
                        </View>
                    </View>
                </View>

                {/* Reviews Count */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        color: colors.TextColorBlack,
                    }}>
                        All Reviews ({reviewData.length})
                    </Text>

                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Medium',
                            color: colors.AppColor,
                            marginRight: 5,
                        }}>
                            Sort by: Newest
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={colors.AppColor} />
                    </TouchableOpacity>
                </View>

                {/* Reviews List */}
                {reviewData.length === 0 ? (
                    <View style={{
                        backgroundColor: '#fff',
                        margin: 10,
                        padding: 40,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Ionicons name="star-outline" size={48} color="#ccc" />
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Inter-Medium',
                            color: '#666',
                            marginTop: 10,
                            textAlign: 'center',
                        }}>
                            No reviews yet
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                            color: '#999',
                            marginTop: 5,
                            textAlign: 'center',
                        }}>
                            Be the first to leave a review!
                        </Text>
                    </View>
                ) : (
                    reviewData.map((review, index) => {
                        // Generate demo data for missing fields
                        const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
                        const likes = generateRandomLikes();
                        const isLiked = generateRandomIsLiked();
                        const property = generateRandomProperty();

                        return (
                            <View key={review.review_id} style={{
                                backgroundColor: '#fff',
                                marginHorizontal: 10,
                                marginBottom: 10,
                                padding: 15,
                                borderRadius: 12,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 3,
                            }}>
                                {/* Review Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: colors.AppColor,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                        }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontFamily: 'Inter-Bold',
                                                color: '#fff',
                                            }}>
                                                {review.customer_name.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontFamily: 'Inter-Bold',
                                                color: colors.TextColorBlack,
                                                marginBottom: 2,
                                            }}>
                                                {review.customer_name}
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontFamily: 'Inter-Regular',
                                                color: '#666',
                                            }}>
                                                {property}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={{
                                        fontSize: 12,
                                        fontFamily: 'Inter-Regular',
                                        color: '#999',
                                    }}>
                                        {formatRelativeTime(review.entrydate)}
                                    </Text>
                                </View>

                                {/* Rating Stars */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    {renderStars(rating)}
                                    <Text style={{
                                        fontSize: 12,
                                        fontFamily: 'Inter-Medium',
                                        color: '#666',
                                        marginLeft: 8,
                                    }}>
                                        {rating}.0
                                    </Text>
                                </View>

                                {/* Review Comment */}
                                <Text style={{
                                    fontSize: 14,
                                    fontFamily: 'Inter-Regular',
                                    color: colors.TextColorBlack,
                                    lineHeight: 20,
                                    marginBottom: 10,
                                }}>
                                    {review.msg}
                                </Text>

                                {/* Review Actions */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Ionicons
                                            name={isLiked ? "heart" : "heart-outline"}
                                            size={18}
                                            color={isLiked ? "#FF3B30" : "#666"}
                                        />
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Regular',
                                            color: '#666',
                                            marginLeft: 5,
                                        }}>
                                            {likes} likes
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Ionicons name="chatbubble-outline" size={16} color="#666" />
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Inter-Regular',
                                            color: '#666',
                                            marginLeft: 5,
                                        }}>
                                            Reply
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default RatingsReviews;