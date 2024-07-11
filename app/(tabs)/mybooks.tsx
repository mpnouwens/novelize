import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { GenericColors } from "@/constants/Colors";
import { ImageCard } from "@/components/ImageCard";
import { SavedBook } from "@/types";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDatabase } from "@/hooks/useDatabase";
import { useRouter } from "expo-router";

export default function Books() {
  const router = useRouter();
  const { getWishList, getReadingGroup } = useDatabase();
  const [wishList, setWishList] = useState<SavedBook[]>([]);
  const [readingGroup, setReadingGroup] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      const storedWishList = await getWishList();
      const storedReadingGroup = await getReadingGroup();
      setWishList(storedWishList);
      setReadingGroup(storedReadingGroup);
      setLoading(false);
    };

    loadBooks();
  }, [getWishList, getReadingGroup]);

  if (loading) {
    return (
      <ThemedSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GenericColors.blue} />
      </ThemedSafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: SavedBook }) => (
    <ImageCard
      imageUri={item.coverImage || ""}
      onPress={() => item.id && router.navigate(`/detail/${item.id}`)}
    />
  );

  // Filter out books without an ID only
  // - reason being that there were some books that were saved without an ID
  const wishListWithIds = wishList.filter((book) => book.id);
  const readingGroupWithIds = readingGroup.filter((book) => book.id);

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView style={{ flex: 1 }}>
        {wishListWithIds.length > 0 || readingGroupWithIds.length > 0 ? (
          <ThemedView style={styles.container}>
            {wishListWithIds.length > 0 && (
              <>
                <ThemedText style={styles.header}>Wishlist</ThemedText>
                <FlatList
                  data={wishListWithIds}
                  renderItem={renderItem}
                  keyExtractor={(item, index) =>
                    item?.id?.toString() || index.toString()
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                />
              </>
            )}
            {readingGroupWithIds.length > 0 && (
              <>
                <ThemedText style={styles.header}>Reading Group</ThemedText>
                <FlatList
                  data={readingGroupWithIds}
                  renderItem={renderItem}
                  keyExtractor={(item, index) =>
                    item?.id?.toString() || index.toString()
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                />
              </>
            )}
          </ThemedView>
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <Image
              source={require("../../assets/images/empty.png")}
              style={styles.emptyImage}
            />
            <ThemedText style={styles.emptyText}>
              {`A new journey begins here!\nStart adding books to your collection.`}
            </ThemedText>
            <View style={styles.searchButtonContainer}>
              <Button
                title="Search Books"
                onPress={() => router.navigate("/")}
                color={GenericColors.blue}
              />
            </View>
          </ThemedView>
        )}
      </ThemedScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Avenir",
    paddingVertical: 5,
  },
  flatListContent: {
    paddingLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Avenir",
  },
  searchButtonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
