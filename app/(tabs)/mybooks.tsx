import { Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { SavedBook } from "@/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDatabase } from "@/hooks/useDatabase";
import { useRouter } from "expo-router";

export default function Books() {
  const router = useRouter();
  const { getWishLists, getReadingGroups } = useDatabase();
  const [wishLists, setWishLists] = useState<SavedBook[]>([]);
  const [readingGroups, setReadingGroups] = useState<string[]>([]);

  useEffect(() => {
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
  }, [getReadingGroups, getWishLists]);

  return (wishLists && wishLists.length > 0) ||
    (readingGroups && readingGroups.length > 0) ? (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <ThemedText
        style={{
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "Avenir",
        }}
      >
        Wishlist
      </ThemedText>
      {wishLists.map((wishList, i) => {
        return (
          <Pressable
            style={{
              margin: 10,
              borderRadius: 10,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            key={i}
            onPress={() => {
              if (wishList.id) {
                router.navigate(`/detail/${wishList.id}`);
              }
            }}
          >
            <Image
              source={{ uri: wishList.coverImage }}
              style={{
                width: 100,
                height: 150,
                resizeMode: "contain",
              }}
            />
          </Pressable>
        );
      })}
    </ThemedView>
  ) : (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/images/empty.png")}
        style={{
          width: 400,
          height: 400,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <ThemedText
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "Avenir",
        }}
      >
        {` A new journey begins here!\nStart adding books to your collection.`}
      </ThemedText>
      <View
        style={{
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Button
          title="Search Books"
          onPress={() => {
            router.navigate("/");
          }}
          color="#00A3FF"
        />
      </View>
    </ThemedView>
  );
}
