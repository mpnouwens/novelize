import { Link, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native";
import { SearchBar } from "@/components/SearchBar";

export default function Search() {
  const { search } = useLocalSearchParams();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 10,
      }}
    >
      <SearchBar defaultValue={search?.toString()} />
      <Link href="/"> Go to Home </Link>
    </SafeAreaView>
  );
}
