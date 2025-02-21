import { View, Text, Image } from "react-native";
import React from "react";
import images from "@/constants/images";

interface Props {
  message?: string;
  style?: string;
}

const NoResult = ({
  message = "We could not find any results.",
  style = "w-11/12 h-80",
}: Props) => {
  return (
    <View className="flex item-center my-5">
      <Image source={images.noResult} className={style} resizeMode="contain" />
      <Text className="text-2xl font-rubik-bold text-black-300 text-center mt-5">
        No Result
      </Text>
      <Text className="text-base text-black-100 text-center mt-2">
        {message}
      </Text>
    </View>
  );
};

export default NoResult;
