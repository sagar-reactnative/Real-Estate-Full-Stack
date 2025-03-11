import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Redirect } from 'expo-router';

const SignIn = () => {
    const { refetch, loading, isLoggedIn } = useGlobalContext();

    if (!loading && isLoggedIn) {
        return <Redirect href="/" />;
    }

    const handleLogin = async () => {
        const result = await login();

        if (result) {
            refetch();
        } else {
            Alert.alert('Login failed.');
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName="h-full">
                <Image source={images.onboarding} className="w-full h-4/6" resizeMode="contain" />
                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">Welcome to ReState</Text>

                    <Text className="text-3xl font-rubik-bold text-center mt-2">
                        <Text className="text-black-300">Let's Get You Closure to</Text> {'\n'}
                        <Text className="text-primary-300">Your Ideal Home</Text>
                    </Text>

                    <Text className="text-lg font-rubik text-black-200 text-center mt-12">Login to ReState with Google</Text>

                    <TouchableOpacity onPress={handleLogin} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                        <View className="flex flex-row items-center justify-center">
                            <Image source={icons.google} className="w-5 h-5" resizeMode="contain" />
                            <Text className="text-lg font-rubik-medium text-black-300 ml-2">Continue with Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
