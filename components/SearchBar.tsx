import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";

import { SearchSvg } from "@/assets/svgs/SearchSvg";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log(searchQuery);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <TextInput
            placeholderTextColor="#A9A9A9"
            placeholder="Search name or ISBN number"
            inputMode="search"
            enterKeyHint="search"
            style={styles.textInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
