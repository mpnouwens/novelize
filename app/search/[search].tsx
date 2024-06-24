import React from "react";
import { SafeAreaView } from "react-native";
import { SearchBar } from "@/components/SearchBar";
import { fetchSearchResults } from "@/utils/fetchResults";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
  const { search } = useLocalSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", search],
    queryFn: () => fetchSearchResults(search?.toString() || ""),
  });

  console.log("search", search);
  console.log("isLoading", isLoading);
  console.log("error", error);
  console.log("data", data);
  console.log("-------");

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
    </SafeAreaView>
  );
}
