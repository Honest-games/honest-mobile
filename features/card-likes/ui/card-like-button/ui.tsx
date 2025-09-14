import { getLevelColor } from "@/features/converters/button-converters";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ICustomView {
  color: string;
  handleLike: () => void;
  isLiked: boolean;
}

export const CardLikeButton = ({ color, handleLike, isLiked }: ICustomView) => {
  return (
    <View style={{ position: "absolute", bottom: 16, right: 16 }}>
      <TouchableOpacity onPress={handleLike}>
        <FontAwesome name={isLiked ? "heart" : "heart-o"} size={24} color={getLevelColor(color)} />
      </TouchableOpacity>
    </View>
  );
};
