import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";

import { ThemedText } from "./ThemedText";
import { colorSlugs } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ButtonProps {
  onPress: () => void;
  title?: string;
  color?: string;
  type?: "text" | "icon";
  svg?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  onPress,
  title,
  color,
  svg,
  style,
  isLoading,
}) => {
  const type = svg ? "icon" : "text";
  const backgroundColor = useThemeColor({}, colorSlugs.emptyBackground);

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: color ? `${color}40` : backgroundColor,
          paddingVertical: 20,
          paddingHorizontal: 15,
          justifyContent: "center",
          margin: 10,
          marginHorizontal: 5,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          height: svg && 60,
          width: svg && 60,
          maxHeight: 60,
        },
        style,
      ]}
    >
      {isLoading && (
        <ActivityIndicator
          color={color}
          style={{
            marginHorizontal: 10,
          }}
        />
      )}
      {type === "text" && title && (
        <ThemedText
          style={{
            fontFamily: "Open Sans",
            color,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {title}
        </ThemedText>
      )}
      {type === "icon" && svg}
    </Pressable>
  );
};

export { Button };
