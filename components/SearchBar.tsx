import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React, { FC, useState } from "react";

import { SearchSvg } from "@/assets/svgs/SearchSvg";
import { useRouter } from "expo-router";

interface SearchBarProps {
  defaultValue?: string | null | undefined;
}

const SearchBar: FC<SearchBarProps> = ({ defaultValue }) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const onPress = () => {
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
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="#A9A9A9"
        placeholder="Search name or ISBN or ID"
        inputMode="search"
        enterKeyHint="search"
        style={[
          styles.textInput,
          isFocused ? styles.textInputFocused : null,
          error && !searchQuery ? styles.textInputError : null,
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Pressable onPress={onPress} style={styles.searchButton}>
        <SearchSvg
          height={24}
          width={24}
          fill={"#00A3FF"}
          style={{
            alignSelf: "center",
          }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 350,
  },
  textInput: {
    color: "#000",
    height: 65,
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingLeft: 20,
    paddingRight: "20%",
    paddingVertical: 10,
    borderRadius: 15,
    fontSize: 16,
  },
  searchButton: {
    position: "absolute",
    backgroundColor: "#00A3FF25",
    right: 5,
    height: 56,
    width: 56,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  textInputError: {
    borderColor: "#FF000025",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#FF000025",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        outlineStyle: "none",
        boxShadow: "0 0 0 1px #FF000025",
      },
    }),
  },

  textInputFocused: {
    borderColor: "#00A3FF25",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#00A3FF25",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        outlineStyle: "none",
        boxShadow: "0 0 0 1px #00A3FF25",
      },
    }),
  },
});

export { SearchBar };
