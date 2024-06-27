import { Image, Pressable, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";

import { Book } from "../types";
import { BookmarkOutlineSvg } from "@/assets/svgs/BookmarkOutlineSvg";
import { BookmarkSolidSvg } from "@/assets/svgs/BookmarkSolidSvg";
import { SmallButton } from "@/components/SmallButton";
import { StarOutlineSvg } from "@/assets/svgs/StarOutlineSvg";
import { StarSolidSvg } from "@/assets/svgs/StarSolidSvg";
import { useDatabase } from "@/context/DatabaseContext";
import { useRouter } from "expo-router";

const Card: FC<{ book: Book }> = ({ book }) => {
  const router = useRouter();
  const [isWishlist, setIsWishlist] = useState(false);
  const [isReadingGroup, setIsReadingGroup] = useState(false);
  const {
    addWishList,
    removeWishList,
    getWishLists,
    addReadingGroup,
    removeReadingGroup,
    getReadingGroups,
  } = useDatabase();

  useEffect(() => {
    const checkStatuses = async () => {
      const wishLists = await getWishLists();
      setIsWishlist(wishLists.some((wish) => wish.ISBN === book.id));

      const readingGroups = await getReadingGroups();
      setIsReadingGroup(readingGroups.includes(book.id));
    };
    checkStatuses();
  }, [book.id, getWishLists, getReadingGroups]);

  const handleWishlistPress = async () => {
    if (isWishlist) {
      await removeWishList(book.id);
    } else {
      await addWishList({
        ISBN: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors.join(", "),
        coverImage: book.volumeInfo.imageLinks.thumbnail,
      });
    }
    setIsWishlist(!isWishlist);
  };

  const handleAddToReadingGroupPress = async () => {
    if (isReadingGroup) {
      await removeReadingGroup(book.id);
    } else {
      await addReadingGroup(book.id);
    }
    setIsReadingGroup(!isReadingGroup);
  };

  return (
    <Pressable
      onPress={() => router.navigate(`/detail/${book.id}`)}
      key={book?.id}
      style={{ maxWidth: 400, maxHeight: 600, overflow: "hidden", margin: 5 }}
    >
      <View
        style={{
          padding: 10,
          borderRadius: 15,
          backgroundColor: "#F7F7F7",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 162, height: 234, borderRadius: 15 }}
            source={{
              uri: book?.volumeInfo.imageLinks?.thumbnail
                ? `${book.volumeInfo.imageLinks.thumbnail}&fife=w400-h600`
                : "https://via.placeholder.com/150",
            }}
          />
          <View style={{ flex: 1, flexDirection: "column", marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "left",
                marginBottom: 5,
              }}
            >
              {book?.volumeInfo?.title
                ? book.volumeInfo.title.length > 50
                  ? `${book.volumeInfo.title.slice(0, 50)}...`
                  : book.volumeInfo.title
                : "Title not available"}
            </Text>
            <Text style={{ textAlign: "left", marginBottom: 5 }}>
              <Text style={{ color: "#858585" }}>by</Text>{" "}
              {book?.volumeInfo.authors?.length > 0
                ? book.volumeInfo.authors.join(", ")
                : "Author(s) not available"}
            </Text>
            <Text style={{ textAlign: "left" }}>
              {book?.volumeInfo.description
                ? book.volumeInfo.description.length > 50
                  ? `${book.volumeInfo.description.slice(0, 50)}...`
                  : book.volumeInfo.description
                : "Description not available"}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,

            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <SmallButton
            onPress={handleWishlistPress}
            svg={
              isWishlist ? (
                <StarSolidSvg width={20} height={20} color="#19BB29" />
              ) : (
                <StarOutlineSvg width={20} height={20} />
              )
            }
          />

          <SmallButton
            onPress={handleAddToReadingGroupPress}
            svg={
              isReadingGroup ? (
                <BookmarkSolidSvg width={20} height={20} color={"#00A3FF"} />
              ) : (
                <BookmarkOutlineSvg width={20} height={20} />
              )
            }
          />
        </View>
      </View>
    </Pressable>
  );
};

export { Card };
