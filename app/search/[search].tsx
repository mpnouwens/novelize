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
import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SearchBar } from "@/components/SearchBar";
import { fetchSearchResults } from "@/utils/fetchResults";
import { getNumColumns } from "@/utils/getNumColumns";
import { useInfiniteQuery } from "@tanstack/react-query";

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
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.totalItems || lastPage.totalItems === 0) {
        return undefined;
      }

      const totalItems = lastPage.totalItems;
      const fetchedItems = allPages.reduce(
        (acc, page) => acc + (page.items ? page.items.length : 0),
        0
      );

      return fetchedItems < totalItems ? fetchedItems : undefined;
    },
    initialPageParam: 0,
  });

  const books = data?.pages.flatMap((page) => page.items || []) || [];
  const uniqueBooks = Array.from(new Set(books.map((book) => book?.id))).map(
    (id) => books.find((book) => book?.id === id)
  );

  useEffect(() => {
    if (uniqueBooks.length === 1) {
      router.replace(`/detail/${uniqueBooks[0]?.id}`);
    }
  }, [uniqueBooks]);

  if (isLoading || status === "pending")
    return (
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
    );

  if (
    !data ||
    data.pages.every((page) => !page.items || page.items.length === 0)
  ) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Text>No results found</Text>
        <Button
          title="Go Back"
          onPress={() => router.navigate("/")}
          color="#00A3FF"
        />
      </SafeAreaView>
    );
  }

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

      {status === "error" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{error.message}</Text>
        </View>
      )}
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
    </SafeAreaView>
  );
}
