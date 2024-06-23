import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
  const router = useRouter();

  const onPress = () => {
    if (Keyboard) Keyboard.dismiss();
    router.navigate({
      pathname: "/search/[search]",
      params: {
        search: searchQuery,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="#A9A9A9"
        placeholder="Search name or ISBN number"
        inputMode="search"
        enterKeyHint="search"
        style={styles.textInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onPress}
      />
      <TouchableOpacity onPress={onPress} style={styles.searchButton}>
        <SearchSvg
          height={24}
          width={24}
          fill={"#00A3FF"}
          style={{
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
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
});

export { SearchBar };
