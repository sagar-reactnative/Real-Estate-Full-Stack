import React, {useEffect} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import {useAppwrite} from "@/lib/useAppwrite";
import {getProperties} from "@/lib/appwrite";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card} from "@/components/Cards";
import NoResult from "@/components/NoResult";
import Search from "@/components/Search";
import Filters from "@/components/Filters";

const Explore = () => {

    const params = useLocalSearchParams<{ query?: string, filter?: string }>();

    const { data: properties, loading: propertiesLoading, refetch } = useAppwrite({
        fn: getProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 6
        },
        skip: true
    });

    useEffect(()=> {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 10
        })
    }, [ params.filter, params.query ]);

    const handleCardPress = (id: string) => router.push(`/properties/${id}`);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={properties}
                renderItem={({item}) => (
                    <Card item={item} onPress={() => handleCardPress(item.$id)} />
                )}
                ListEmptyComponent={(
                    propertiesLoading
                        ? <ActivityIndicator size="large" className="text-primary-300 mt-5" />
                        : <NoResult />
                )}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-5"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-5">
                        <Search />
                        <Filters />
                        {
                            properties && properties.length > 0 &&
                            <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                                Found {properties?.length} Properties
                            </Text>
                        }
                    </View>
                }
            />
        </SafeAreaView>
    )
}

export default Explore
