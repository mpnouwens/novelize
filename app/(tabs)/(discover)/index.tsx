import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { GenericColors, colorSlugs } from "@/constants/Colors";

import { LogoSvg } from "@/assets/svgs/LogoSvg";
import React from "react";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import appConfig from "../../../app.json";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Home() {
  const color = useThemeColor({}, colorSlugs.text);

  const content = (
    <Animated.View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LogoSvg
        color={color}
        height={35}
        style={{
          marginBottom: 10,
        }}
      />
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 30,
          fontFamily: "Avenir",
          textAlign: "center",
        }}
      >
        {`Uncover the Story,\nSkip the Fluff`}
      </ThemedText>
      <SearchBar />
      <ThemedText
        style={{
          fontSize: 12,
          color: GenericColors.grey,
          marginTop: 10,
        }}
      >
        v{appConfig.expo.version}
      </ThemedText>
    </Animated.View>
  );

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Platform.OS === "web" ? (
        content
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {content}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
    </ThemedView>
  );
}
