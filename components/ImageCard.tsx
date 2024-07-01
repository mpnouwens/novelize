import { Image, Pressable, StyleProp, ViewStyle } from "react-native";

import { GenericColors } from "@/constants/Colors";
import React from "react";

interface ImageCardProps {
  imageUri: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUri, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          margin: 10,
          borderRadius: 10,
          overflow: "hidden",
          shadowColor: GenericColors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style,
      ]}
    >
      <Image
        source={{
          uri: imageUri
            ? `${imageUri}&fife=w400-h600`
            : "https://via.placeholder.com/150",
        }}
        style={[
          {
            resizeMode: "stretch",
            width: 150,
            height: 250,
          },
        ]}
      />
    </Pressable>
  );
};

export { ImageCard };
