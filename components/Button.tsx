import { Pressable, Text } from "react-native";
import React, { FC } from "react";

interface ButtonProps {
  onPress: () => void;
  title?: string;
  color?: string;
  type?: "text" | "icon";
  svg?: JSX.Element;
}

const Button: FC<ButtonProps> = ({
  onPress,
  title,
  color = "#000000",
  type = "text",
  svg,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: `${color}25`,
        paddingVertical: 20,
        paddingHorizontal: 15,
        margin: 10,
        marginHorizontal: 5,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {type === "text" && title && (
        <Text
          style={{
            fontFamily: "Open Sans",
            color,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      )}
      {type === "icon" && svg}
    </Pressable>
  );
};

export { Button };
