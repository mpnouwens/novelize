import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { LogoSvg } from "@/assets/svgs/LogoSvg";
import React from "react";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  const content = (
    <Animated.View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LogoSvg
        height={35}
        style={{
          marginBottom: 10,
        }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 30,
          fontFamily: "Avenir",
          textAlign: "center",
        }}
      >
        {`Uncover the Story,\nSkip the Fluff`}
      </Text>
      <SearchBar />
    </Animated.View>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
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
    </View>
  );
}
