import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SearchBar } from "@/components/SearchBar";
import { fetchSearchResults } from "@/utils/fetchResults";
import { getNumColumns } from "@/utils/getNumColumns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Search() {
  const { search } = useLocalSearchParams();
  const [numColumns, setNumColumns] = useState(getNumColumns());

  useEffect(() => {
    const updateColumns = () => {
      setNumColumns(getNumColumns());
    };

    const subscription = Dimensions.addEventListener("change", updateColumns);

    return () => {
      subscription.remove();
    };
  }, []);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["searchResults", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchSearchResults(search?.toString() || "", pageParam),
    getNextPageParam: (lastPage, allPages) => allPages.length * 20,
    initialPageParam: 0,
  });

  const books = data?.pages.flatMap((page) => page.items) || [];
  const uniqueBooks = Array.from(new Set(books.map((book) => book.id))).map(
    (id) => books.find((book) => book.id === id)
  );

  const content = <SearchBar defaultValue={search?.toString()} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        {Platform.OS === "web" ? (
          content
        ) : (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {content}
          </TouchableWithoutFeedback>
        )}
      </View>

      {status === "pending" || isLoading ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <ActivityIndicator size="large" color="#00A3FF" />
        </SafeAreaView>
      ) : status === "error" ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Text>Error: {error.message}</Text>
        </SafeAreaView>
      ) : (
        <FlatList
          key={numColumns}
          data={uniqueBooks}
          numColumns={numColumns}
          keyExtractor={(item, index) => `${item?.id}${index}`}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1 / numColumns,
                alignItems: Platform.OS === "web" ? "center" : undefined,
              }}
            >
              <Card book={item} />
            </View>
          )}
          ListFooterComponent={() => (
            <>
              {isFetching && (
                <View style={{ alignItems: "center", marginVertical: 15 }}>
                  <ActivityIndicator size="small" color="#00A3FF" />
                </View>
              )}

              {!isFetchingNextPage && hasNextPage && (
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Button
                    title="Load More"
                    onPress={() => fetchNextPage()}
                    color="#00A3FF"
                  />
                </View>
              )}
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
}
