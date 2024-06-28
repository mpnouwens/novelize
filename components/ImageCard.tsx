import { Image, Platform, Pressable, StyleProp, ViewStyle } from "react-native";

import { GenericColors } from "@/constants/Colors";
import React from "react";

interface ImageCardProps {
  imageUri: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUri, onPress, style }) => {
  const imageSize = Platform.select({
    web: { width: 200, height: 300 },
    default: { width: 150, height: 250 },
  });

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
            resizeMode: "contain",
          },
          imageSize,
        ]}
      />
    </Pressable>
  );
};

export { ImageCard };
