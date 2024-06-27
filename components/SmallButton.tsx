import { Pressable, StyleProp, ViewStyle } from "react-native";
import React, { FC } from "react";

interface ButtonProps {
  onPress: () => void;
  svg: JSX.Element;
  style?: StyleProp<ViewStyle>;
}

const SmallButton: FC<ButtonProps> = ({ onPress, svg, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          borderRadius: 10,
        },
        style,
      ]}
    >
      {svg}
    </Pressable>
  );
};

export { SmallButton };
