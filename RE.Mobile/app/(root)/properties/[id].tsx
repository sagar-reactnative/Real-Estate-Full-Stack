import React, { useEffect, useRef, useState } from 'react';
import Currency from '@/components/Currency';
import NoResult from '@/components/NoResult';
import icons from '@/constants/icons';
import images from '@/constants/images';
import Swiper from 'react-native-swiper';
import { get } from '@/lib/api';
import { PropertyDetailModel } from '@/models/property/property-detail.model';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Dimensions, ScrollView, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';

const Property = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [data, setData] = useState<PropertyDetailModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewItemsToShow, setReviewItemsToShow] = useState<number>(1);

    const swiperRef = useRef<Swiper>(null);

    useEffect(() => {
        setLoading(true);
        get<PropertyDetailModel>('/properties/' + id)
            .then(property => setData(property))
            .finally(() => setLoading(false));
    }, []);

    const windowHeight: number = Dimensions.get('window').height;

    const getFacilityIcon = (type: string): any => {
        switch (type) {
            case 'Laundry':
                return icons.laundry;
            case 'Parking':
                return icons.carPark;
            case 'Sports-Center':
                return icons.run;
            case 'Cutlery':
                return icons.cutlery;
            case 'Gym':
                return icons.dumbell;
            case 'Swimming-pool':
                return icons.swim;
            case 'Wifi':
                return icons.wifi;
            case 'Pet-Friendly':
                return icons.dog;
            default:
                return icons.info;
        }
    };

    const toggleShowAllReviews = () => {
        if (data == null) {
            return;
        }

        if (reviewItemsToShow === 1) {
            setReviewItemsToShow(data.reviews.length);
        } else {
            setReviewItemsToShow(1);
        }
    };

    if (loading) {
        return (
            <View className="flex items-center justify-center h-full w-full">
                <ActivityIndicator size="large" className="text-primary-300 mt-5" />
            </View>
        );
    }

    if (data == null) {
        return (
            <View className="flex items-center justify-center h-full w-full">
                <NoResult style="h-80" message="We could not find selected property." />
            </View>
        );
    }

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-20 bg-white">
                <View className="relative w-full" style={{ height: windowHeight / 2 }}>
                    {data.images && data.images.length > 0 && (
                        <Swiper
                            ref={swiperRef}
                            loop={true}
                            dot={<View className="w-3 h-1 mx-1 rounded-full bg-accent-100" />}
                            activeDot={<View className="w-3 h-1 rounded-full mx-1 bg-primary-300" />}>
                            {data.images.map(image => (
                                <Image key={image.id} source={{ uri: image.url }} className="size-full" resizeMode="cover" />
                            ))}
                        </Swiper>
                    )}

                    {/* Gradient image has rounded border in top left, so moving image by 40 point up to hide that */}
                    <Image source={images.whiteGradient} className="absolute width-full z-40" style={{ top: -40 }} />
                </View>

                <View className="z-50 absolute inset-x-7 top-5">
                    <View className="flex flex-row justify-between">
                        <TouchableOpacity
                            className="flex justify-center items-center bg-primary-200 rounded-full size-11"
                            onPress={() => router.back()}>
                            <Image source={icons.backArrow} className="size-7" />
                        </TouchableOpacity>
                        <View className="flex flex-row gap-5">
                            <Image source={icons.heart} className="size-7" tintColor={'#191D31'} />
                            <Image source={icons.send} className="size-7" />
                        </View>
                    </View>
                </View>

                <View className="p-5">
                    <View className="mb-5">
                        <Text className="font-rubik-extrabold text-2xl mb-5">{data.title}</Text>
                        <View className="flex flex-row items-center gap-3 mb-5">
                            <View className="px-4 py-2 bg-primary-200 rounded-full">
                                <Text className="text-xs text-primary-300 font-rubik-medium">{data.category.title.toUpperCase()}</Text>
                            </View>
                            <View className="flex flex-row items-center gap-1">
                                <Image source={icons.star} className="size-5" />
                                <Text className="text-xs">
                                    {data.averageRating} / 5 ({data.reviews?.length ?? 0} reviews)
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row items-center justify-between">
                            <View className="flex flex-row justify-center items-center gap-2">
                                <View className="p-2 bg-primary-200 rounded-full">
                                    <Image source={icons.bed} className="size-5" />
                                </View>
                                <Text className="text-sm font-rubik-bold">{data.beds} Beds</Text>
                            </View>

                            <View className="flex flex-row justify-center items-center gap-2">
                                <View className="p-2 bg-primary-200 rounded-full">
                                    <Image source={icons.bath} className="size-5" />
                                </View>
                                <Text className="text-sm font-rubik-bold">{data.baths} baths</Text>
                            </View>

                            <View className="flex flex-row justify-center items-center gap-2">
                                <View className="p-2 bg-primary-200 rounded-full">
                                    <Image source={icons.area} className="size-5" />
                                </View>
                                <Text className="text-sm font-rubik-bold">{data.sqft} sqft</Text>
                            </View>
                        </View>
                    </View>

                    <View className="border-t border-primary-200 mb-5"></View>

                    <View className="mb-5">
                        <Text className="font-rubik-bold text-xl mb-3">Agent</Text>
                        <View className="flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center gap-5">
                                <Image source={{ uri: data.agent.avatar }} className="size-14 rounded-full" />
                                <View className="flex flex-col justify-center">
                                    <Text className="font-rubik-bold text-lg">
                                        {data.agent.firstName} {data.agent.lastName}
                                    </Text>
                                    <Text className="font-rubik text-black-200">{data.agent.email}</Text>
                                </View>
                            </View>
                            <View className="flex flex-row items-center gap-4">
                                <Image source={icons.chat} className="size-9" />
                                <Image source={icons.phone} className="size-9" />
                            </View>
                        </View>
                    </View>

                    <View className="my-5">
                        <Text className="font-rubik-bold text-xl mb-3">Overview</Text>
                        <Text className="text-justify font-rubik text-black-200">{data.description}</Text>
                    </View>

                    {data.facilities && data.facilities.length > 0 && (
                        <View className="my-5">
                            <Text className="font-rubik-bold text-xl mb-3">Facilities</Text>
                            <View className="flex flex-row flex-wrap mt-2 gap-5">
                                {data.facilities.map(facility => (
                                    <View key={facility.id} className="flex flex-1 flex-col items-start min-w-20">
                                        <View className="p-3 bg-primary-200 rounded-full">
                                            <Image source={getFacilityIcon(facility.type)} className="size-7" />
                                        </View>
                                        <Text numberOfLines={1} className="font-rubik text-black-300 text-center text-sm mt-2">
                                            {facility.title}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {data.images && data.images.length > 0 && (
                        <View className="my-5">
                            <Text className="font-rubik-bold text-xl mb-3">Gallery</Text>
                            <FlatList
                                data={data.images}
                                renderItem={({ item }) => <Image source={{ uri: item.url }} className="size-60 rounded-xl" />}
                                keyExtractor={item => item.id}
                                bounces={false}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerClassName="flex gap-4"
                            />
                        </View>
                    )}

                    <View className="my-5">
                        <Text className="font-rubik-bold text-xl mb-3">Location</Text>
                        <View className="flex flex-row items-center justify-start gap-3 mb-3">
                            <Image source={icons.location} className="size-7" />
                            <Text className="font-rubik-bold text-lg text-black-100">{data.address}</Text>
                        </View>
                        <Image source={images.map} className="h-52 w-full rounded-xl" />
                    </View>

                    {data.reviews && data.reviews.length > 0 && (
                        <View className="my-5">
                            <View className="flex flex-row items-center justify-between mb-4">
                                <View className="flex flex-row items-center justify-start gap-4">
                                    <Image source={icons.star} className="size-7" />
                                    <Text className="font-rubik-bold my-auto mt-2 text-xl">
                                        {data.averageRating} ({data.reviews.length} reviews)
                                    </Text>
                                </View>
                                {data.reviews.length > 1 && (
                                    <TouchableOpacity className="mt-2" onPress={toggleShowAllReviews}>
                                        {reviewItemsToShow === 1 && <Text className="font-rubik-bold text-primary-300">View All</Text>}
                                        {reviewItemsToShow > 1 && <Text className="font-rubik-bold text-primary-300">View Less</Text>}
                                    </TouchableOpacity>
                                )}
                            </View>
                            {data.reviews.slice(0, reviewItemsToShow).map(review => (
                                <View key={review.id} className="flex flex-col gap-2 my-2">
                                    <View className="flex flex-row items-center justify-start gap-3">
                                        <Image source={{ uri: review.user.avatar }} className="size-12 rounded-full" />
                                        <Text className="font-rubik-bold text-lg">
                                            {review.user.firstName} {review.user.lastName}
                                        </Text>
                                    </View>
                                    <Text className="font-rubik text-black-200 text-justify">{review.text}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
            <View className="absolute bg-white bottom-0 w-full rounded-t-3xl border-t border-r border-l border-primary-200 p-5">
                <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-col gap-3">
                        <Text className="font-rubik-bold text-black-200 tracking-widest">PRICE</Text>
                        <Currency amount={data.price} style="text-3xl text-primary-300 font-rubik-extrabold" />
                    </View>
                    <TouchableOpacity>
                        <View className="p-5 bg-primary-300 rounded-full min-w-48 flex flex-row justify-center">
                            <Text className="font-rubik-bold text-xl text-white">Book Now</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Property;
