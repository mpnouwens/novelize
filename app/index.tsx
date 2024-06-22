import { Text, View } from "react-native";

import { SearchBar } from "@/components/SearchBar";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <SearchBar />
    </View>
  );
}
