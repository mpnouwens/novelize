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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDatabase } from "@/hooks/useDatabase";
import { useRouter } from "expo-router";

export default function Books() {
  const router = useRouter();
  const { getWishLists, getReadingGroups } = useDatabase();
  const [wishLists, setWishLists] = useState<SavedBook[]>([]);
  const [readingGroups, setReadingGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadWishLists = async () => {
      const storedWishLists = await getWishLists();
      setWishLists(storedWishLists);
    };

    const loadReadingGroups = async () => {
      const storedReadingGroups = await getReadingGroups();
      setReadingGroups(storedReadingGroups);
    };

    loadWishLists();
    loadReadingGroups();
    setLoading(false);
  }, [getReadingGroups, getWishLists]);

  if (loading) {
    return (
      <ThemedSafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={GenericColors.blue} />
      </ThemedSafeAreaView>
    );
  }

  const renderItem = ({ item, index }: { item: SavedBook; index: number }) => (
    <ImageCard
      key={index}
      imageUri={item.coverImage || ""}
      onPress={() => item.id && router.navigate(`/detail/${item.id}`)}
    />
  );
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      {(wishLists && wishLists.length > 0) ||
      (readingGroups && readingGroups.length > 0) ? (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.wishlistHeader}>Wishlist</ThemedText>
          <FlatList
            data={wishLists}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
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
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  wishlistHeader: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Avenir",
  },
  row: {
    flex: 1,
    marginBottom: 5,
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
