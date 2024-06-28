import { ScrollView, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { colorSlugs } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorSlugs.background
  );

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
