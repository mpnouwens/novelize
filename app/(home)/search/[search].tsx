import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { SafeAreaView } from "react-native";
import { SearchBar } from "@/components/SearchBar";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const fetchSearchResults = async (search: string) => {
  const response = await axios.get(`/search/api/${search}`);
  return response.data;
};

export default function Search() {
  const { search } = useLocalSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults"],
    queryFn: async () => await fetchSearchResults(search?.toString() || ""),
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
