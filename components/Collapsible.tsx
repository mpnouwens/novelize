import { Colors, colorSlugs } from "@/constants/Colors";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import ChevronDownSvg from "@/assets/svgs/ChevronDownSvg";
import ChevronUpSvg from "@/assets/svgs/ChevronUpSvg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "../hooks/useColorScheme";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        {isOpen ? (
          <ChevronDownSvg
            height={18}
            width={18}
            color={
              theme === "light"
                ? Colors.light[colorSlugs.icon]
                : Colors.dark[colorSlugs.icon]
            }
          />
        ) : (
          <ChevronUpSvg
            height={18}
            width={18}
            color={
              theme === "light"
                ? Colors.light[colorSlugs.icon]
                : Colors.dark[colorSlugs.icon]
            }
          />
        )}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
