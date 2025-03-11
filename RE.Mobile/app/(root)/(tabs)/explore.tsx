import React, { useEffect, useState } from 'react';
import NoResult from '@/components/NoResult';
import Search from '@/components/Search';
import Filters from '@/components/Filters';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Card } from '@/components/Cards';
import { PropertyListModel } from '@/models/property/property-list.model';
import { get } from '@/lib/api';

const Explore = () => {
    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const [properties, setProperties] = useState<PropertyListModel[]>([]);
    const [propertiesLoading, setPropertiesLoading] = useState<boolean>(false);

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
                        <Search />
                        <Filters />
                        {properties && properties.length > 0 && (
                            <Text className="text-xl font-rubik-bold text-black-300 mt-5">Found {properties?.length} Properties</Text>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default Explore;
