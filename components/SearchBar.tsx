import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { GenericColors, colorSlugs } from "@/constants/Colors";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";

import { Button } from "./Button";
import { SearchSvg } from "@/assets/svgs/SearchSvg";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SearchBarProps {
  defaultValue?: string | null | undefined;
  header?: boolean;
  state?: "opened" | "closed";
  onStateChange?: (state: "opened" | "closed") => void;
}

const SearchBar: FC<SearchBarProps> = ({
  defaultValue,
  header,
  state: s,
  onStateChange,
}) => {
  const backgroundColor = useThemeColor({}, colorSlugs.background);
  const emptyBackground = useThemeColor({}, colorSlugs.emptyBackground);
  const color = useThemeColor({}, colorSlugs.text);
  const deviceWidth = useWindowDimensions().width;
  const [currentWidth, setCurrentWidth] = useState(400);
  const [state, setState] = useState<"opened" | "closed">(
    s ? s : header ? "closed" : "opened"
  );

  console.log('header && state === "closed"', header && state === "closed");

  const width = useSharedValue(header ? 60 : currentWidth);
  const fullHeaderWidth = deviceWidth;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      zIndex: state === "opened" ? 1 : 0,
    };
  });

  const [searchQuery, setSearchQuery] = useState(defaultValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (header && state === "opened") {
      inputRef.current?.focus();
    }
    onStateChange && onStateChange(state);
  }, [header, onStateChange, state]);

  useEffect(() => {
    if (header && state === "opened") {
      width.value = fullHeaderWidth;
    } else if (header && state === "closed") {
      width.value = 60;
    }
  }, [state, header, fullHeaderWidth, width]);

  const onPress = () => {
    if (state === "opened") {
      const trimmedSearchQuery = searchQuery.trim();

      if (!trimmedSearchQuery) {
        setError(true);
        return;
      }

      if (Keyboard) Keyboard.dismiss();

      router.navigate({
        pathname: "/search/[search]",
        params: {
          search: trimmedSearchQuery,
        },
      });
    }

    if (state === "closed") {
      setState("opened");
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: width.value,
          position: header && state === "opened" ? "absolute" : "relative",
          backgroundColor: header ? backgroundColor : undefined,
          zIndex: state === "opened" ? 1 : 0,
        },
        animatedStyle,
      ]}
    >
      <TextInput
        ref={inputRef}
        placeholderTextColor="#A9A9A9"
        placeholder="Search name or ISBN or ID"
        inputMode="search"
        enterKeyHint="search"
        style={[
          styles.textInput,
          isFocused ? styles.textInputFocused : null,
          error && !searchQuery ? styles.textInputError : null,
          {
            backgroundColor: emptyBackground,
            color,
            marginRight: 0,
            display: header && state === "closed" ? "none" : "flex",
            borderTopLeftRadius:
              !header || (header && state === "opened") ? 15 : 0,
            borderBottomLeftRadius:
              !header || (header && state === "opened") ? 15 : 0,
          },
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onPress}
        onFocus={() => {
          setCurrentWidth(header ? fullHeaderWidth : currentWidth);
          setState(header ? "opened" : state);
          setIsFocused(true);
        }}
        onBlur={() => {
          setCurrentWidth(header ? 60 : currentWidth);
          setState(header ? "closed" : state);
          setIsFocused(false);
        }}
      />
      <Button
        style={{
          marginLeft: 0,
          borderRadius: header && state === "closed" ? 15 : 0,
          borderTopRightRadius:
            header && state === "closed"
              ? 15
              : !header || (header && state === "opened")
              ? 15
              : 0,
          borderBottomRightRadius:
            header && state === "closed"
              ? 15
              : !header || (header && state === "opened")
              ? 15
              : 0,
        }}
        color={GenericColors.blue}
        onPress={onPress}
        svg={
          <SearchSvg
            height={24}
            width={24}
            fill={GenericColors.blue}
            style={{
              alignSelf: "center",
            }}
          />
        }
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 60,
    width: "60%",
    paddingLeft: 20,
    paddingVertical: 10,
    fontSize: 16,
  },
  textInputError: {
    borderColor: `${GenericColors.red}25`,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: `${GenericColors.red}25`,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        outlineStyle: "none",
        boxShadow: `0 0 0 1px ${GenericColors.red + "25"}`,
      },
    }),
  },
  textInputFocused: {
    borderColor: `${GenericColors.blue}25`,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: `${GenericColors.blue}25`,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        outlineStyle: "none",
        boxShadow: `0 0 0 1px  ${GenericColors.blue + "25"}`,
      },
    }),
  },
});

export { SearchBar };
