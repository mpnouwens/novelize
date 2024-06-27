import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Book } from "@/types";
import { BookmarkOutlineSvg } from "@/assets/svgs/BookmarkOutlineSvg";
import { BookmarkSolidSvg } from "@/assets/svgs/BookmarkSolidSvg";
import { Button } from "@/components/Button";
import RenderHtml from "react-native-render-html";
import { StarOutlineSvg } from "@/assets/svgs/StarOutlineSvg";
import { StarSolidSvg } from "@/assets/svgs/StarSolidSvg";
import { fetchSingleBook } from "@/utils/fetchSingleBook";
import { useDatabase } from "@/context/DatabaseContext";
import { useQuery } from "@tanstack/react-query";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    addWishList,
    removeWishList,
    getWishLists,
    addReadingGroup,
    removeReadingGroup,
    getReadingGroups,
  } = useDatabase();

  const [isWishlist, setIsWishlist] = useState(false);
  const [isReadingGroup, setIsReadingGroup] = useState(false);

  useEffect(() => {
    const checkStatuses = async () => {
      if (typeof id === "string") {
        const wishLists = await getWishLists();
        setIsWishlist(wishLists.some((wish) => wish.ISBN === id));

        const readingGroups = await getReadingGroups();
        setIsReadingGroup(readingGroups.includes(id));
      }
    };
    checkStatuses();
  }, [id, getWishLists, getReadingGroups]);

  const handleWishlistPress = async () => {
    if (typeof id === "string" && book) {
      if (isWishlist) {
        await removeWishList(id);
      } else {
        const bookData = {
          ISBN: id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors.join(", "),
          coverImage: book.volumeInfo.imageLinks.thumbnail,
        };
        await addWishList(bookData);
      }
      setIsWishlist(!isWishlist);
    }
  };

  const handleAddToReadingGroupPress = async () => {
    if (typeof id === "string") {
      if (isReadingGroup) {
        await removeReadingGroup(id);
      } else {
        await addReadingGroup(id);
      }
      setIsReadingGroup(!isReadingGroup);
    }
  };

  const fetchBookQuery = useMemo(
    () => ({
      queryKey: ["fetchSingleBook", id],
      queryFn: () =>
        id ? fetchSingleBook(id.toString()) : Promise.reject("ID is undefined"),
      enabled: !!id,
    }),
    [id]
  );

  const {
    isLoading,
    error,
    data: book,
    refetch,
  } = useQuery<Book>(fetchBookQuery);

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An error occurred</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%",
            marginTop: 10,
          }}
        >
          <Button color="#00A3FF" onPress={refetch} title="Retry" type="text" />
          <Button
            color="#00A3FF"
            onPress={() => router.navigate("/")}
            title="Go Home"
            type="text"
          />
        </View>
      </View>
    );

  const imageUri =
    book?.volumeInfo?.imageLinks?.large ||
    book?.volumeInfo?.imageLinks?.medium ||
    book?.volumeInfo?.imageLinks?.thumbnail ||
    "https://via.placeholder.com/150";

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          paddingVertical: 20,
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ height: 400, width: 300, borderRadius: 15 }}
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: Platform.OS === "web" ? 30 : 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 5,
            fontFamily: "Avenir",
          }}
        >
          {book?.volumeInfo?.title}
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 5,
            fontFamily: "Open Sans",
            fontSize: 20,
            maxWidth: 300,
          }}
        >
          <Text style={{ color: "#00000050" }}>by</Text>{" "}
          {book?.volumeInfo?.authors?.join(", ")}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          {book?.saleInfo?.buyLink && (
            <Button
              color="#8F00FF"
              title="Purchase"
              onPress={() => {
                if (book?.saleInfo?.buyLink) {
                  window.open(book.saleInfo.buyLink, "_blank");
                }
              }}
              type="text"
            />
          )}
          <Button
            color="#00A3FF"
            onPress={handleAddToReadingGroupPress}
            type="icon"
            svg={
              isReadingGroup ? (
                <BookmarkSolidSvg color="#00A3FF" height={24} width={24} />
              ) : (
                <BookmarkOutlineSvg color="#00A3FF" height={24} width={24} />
              )
            }
          />
          <Button
            color="#19BB29"
            onPress={handleWishlistPress}
            type="icon"
            svg={
              isWishlist ? (
                <StarSolidSvg color="#19BB29" height={24} width={24} />
              ) : (
                <StarOutlineSvg color="#19BB29" height={24} width={24} />
              )
            }
          />
        </View>

        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 10,
            maxWidth: 400,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "left",
              marginBottom: 10,
              fontFamily: "Avenir",
            }}
          >
            About
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontFamily: "Open Sans",
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            <RenderHtml
              source={{
                html:
                  book?.volumeInfo?.description || "Description not available.",
              }}
            />
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;
