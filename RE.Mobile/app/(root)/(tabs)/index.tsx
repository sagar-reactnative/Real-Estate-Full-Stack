import { ActivityIndicator, FlatList, SafeAreaView, Image, Text, View, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '@/lib/global-provider';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { get } from '@/lib/api';
import { PropertyListModel } from '@/models/property/property-list.model';
import { Card, FeaturedCard } from '@/components/Cards';
import NoResult from '@/components/NoResult';
import icons from '@/constants/icons';
import Search from '@/components/Search';
import Filters from '@/components/Filters';

const Index = () => {
    const { user } = useGlobalContext();

    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const [latestProperties, setLatestProperties] = useState<PropertyListModel[]>([]);
    const [latestPropertiesLoading, setLatestPropertiesLoading] = useState<boolean>(false);

    const [properties, setProperties] = useState<PropertyListModel[]>([]);
    const [propertiesLoading, setPropertiesLoading] = useState<boolean>(false);

    useEffect(() => {
        setLatestPropertiesLoading(true);
        get<PropertyListModel[]>('/properties/latest')
            .then(properties => setLatestProperties(properties ?? []))
            .finally(() => setLatestPropertiesLoading(false));
    }, []);

    useEffect(() => {
        setPropertiesLoading(true);
        get<PropertyListModel[]>('/properties', {
            params: {
                category: params.filter!,
                query: params.query!,
                limit: 6
            }
        })
            .then(properties => setProperties(properties ?? []))
            .finally(() => setPropertiesLoading(false));
    }, [params.filter, params.query]);

    const handleCardPress = (id: string) => router.push(`/properties/${id}`);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={properties}
                renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.id)} />}
                ListEmptyComponent={propertiesLoading ? <ActivityIndicator size="large" className="text-primary-300 mt-5" /> : <NoResult />}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-5"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="flex flex-row items-center justify-between mt-5">
                            <View className="flex flex-row items-center">
                                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" />
                                <View className="flex flex-col items-start justify-center ml-2">
                                    <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                                    <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                                </View>
                            </View>
                            <Image source={icons.bell} className="size-6" />
                        </View>

                        <Search />

                        {/* Hide entire featured properties section if there is no Featured property in database */}
                        {latestPropertiesLoading && <ActivityIndicator size="large" className="text-primary-300 mt-5" />}
                        {!latestPropertiesLoading && latestProperties && latestProperties.length > 0 && (
                            <View className="my-5">
                                <View className="flex flex-row items-center justify-between">
                                    <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                                    <TouchableOpacity>
                                        <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={latestProperties}
                                    renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.id)} />}
                                    keyExtractor={item => item.id}
                                    horizontal
                                    bounces={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerClassName="flex gap-5 mt-5"
                                />
                            </View>
                        )}

                        <View className="my-5">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
                                <TouchableOpacity>
                                    <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                                </TouchableOpacity>
                            </View>

                            <Filters />
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default Index;
