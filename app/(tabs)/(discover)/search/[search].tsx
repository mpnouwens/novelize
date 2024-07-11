import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GenericColors, colorSlugs } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SearchBar } from "@/components/SearchBar";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { fetchSearchResults } from "@/utils/fetchResults";
import { getNumColumns } from "@/utils/getNumColumns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Search() {
  const { search } = useLocalSearchParams();
  const [numColumns, setNumColumns] = useState(getNumColumns());
  const backgroundColor = useThemeColor({}, colorSlugs.background);

  const navigation = useNavigation();
  const [searchBarState, setSearchBarState] = useState<"opened" | "closed">(
    "closed"
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 80,
        backgroundColor,
      },
      header: () => (
        <ThemedSafeAreaView>
          <View
            style={{
              height: 70,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Platform.OS === "web" ? (
              <SearchBar defaultValue={search?.toString()} />
            ) : (
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SearchBar
                    defaultValue={search?.toString()}
                    header
                    onStateChange={setSearchBarState}
                  />
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            )}
          </View>
        </ThemedSafeAreaView>
      ),
    });
  }, [backgroundColor, navigation, search, searchBarState]);

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
      <ThemedSafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={GenericColors.blue} />
      </ThemedSafeAreaView>
    );

  if (
    !data ||
    data.pages.every((page) => !page.items || page.items.length === 0)
  ) {
    return (
      <ThemedSafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No results found</Text>
        <Button
          title="Go Back"
          onPress={() => router.navigate("/")}
          color={GenericColors.blue}
        />
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
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
              justifyContent: "center",
              alignItems: Platform.OS === "web" ? "center" : undefined,
              padding: 10,
            }}
          >
            <Card book={item} />
          </View>
        )}
        ListFooterComponent={() => (
          <>
            {isFetching && (
              <View style={{ alignItems: "center", marginVertical: 15 }}>
                <ActivityIndicator size="small" color={GenericColors.blue} />
              </View>
            )}

            {!isFetchingNextPage && hasNextPage && (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Button
                  title="Load More"
                  onPress={() => fetchNextPage()}
                  color={GenericColors.blue}
                />
              </View>
            )}
          </>
        )}
      />
    </ThemedSafeAreaView>
  );
}
