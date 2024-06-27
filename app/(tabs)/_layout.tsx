import { BookOutlineSvg } from "@/assets/svgs/BookOutlineSvg";
import BookSolidSvg from "@/assets/svgs/BookSolidSvg";
import { EyeOutlineSvg } from "@/assets/svgs/EyeOutlineSvg";
import { EyeSolidSvg } from "@/assets/svgs/EyeSolidSvg";
import React from "react";
import { Tabs } from "expo-router";
import { colorSlugs } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor({}, colorSlugs.tabIconSelected),
        headerShown: false,
        tabBarStyle: {
          backgroundColor: useThemeColor({}, colorSlugs.background),
          borderTopColor: useThemeColor({}, colorSlugs.emptyBackground),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <EyeSolidSvg color={color} />
            ) : (
              <EyeOutlineSvg color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="mybooks"
        options={{
          title: "My Books",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <BookSolidSvg color={color} />
            ) : (
              <BookOutlineSvg color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
