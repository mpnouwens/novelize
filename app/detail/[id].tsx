import * as Linking from "expo-linking";

import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GenericColors, colorSlugs } from "@/constants/Colors";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Book } from "@/types";
import { BookmarkOutlineSvg } from "@/assets/svgs/BookmarkOutlineSvg";
import { BookmarkSolidSvg } from "@/assets/svgs/BookmarkSolidSvg";
import { Button } from "@/components/Button";
import RenderHtml from "react-native-render-html";
import { StarOutlineSvg } from "@/assets/svgs/StarOutlineSvg";
import { StarSolidSvg } from "@/assets/svgs/StarSolidSvg";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchSingleBook } from "@/utils/fetchSingleBook";
import { useDatabase } from "@/hooks/useDatabase";
import { useQuery } from "@tanstack/react-query";
import { useThemeColor } from "@/hooks/useThemeColor";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const color = useThemeColor({}, colorSlugs.text);

  const {
    addWishList,
    removeWishList,
    getWishList,
    addReadingGroup,
    removeReadingGroup,
    getReadingGroup,
  } = useDatabase();

  const [isWishlist, setIsWishlist] = useState(false);
  const [isReadingGroup, setIsReadingGroup] = useState(false);

  useEffect(() => {
    const checkStatuses = async () => {
      if (typeof id === "string") {
        const wishLists = await getWishList();
        setIsWishlist(wishLists.some((wish) => wish.id === id));

        const readingGroups = await getReadingGroup();
        setIsReadingGroup(readingGroups.some((g) => g.id === id));
      }
    };
    checkStatuses();
  }, [id, getWishList, getReadingGroup]);

  const handleWishlistPress = async () => {
    if (typeof id === "string" && book) {
      if (isWishlist) {
        await removeWishList(id);
      } else {
        const bookData = {
          id: id,
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
    if (typeof id === "string" && book) {
      if (isReadingGroup) {
        await removeReadingGroup(id);
      } else {
        const bookData = {
          id: id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors.join(", "),
          coverImage: book.volumeInfo.imageLinks.thumbnail,
        };
        await addReadingGroup(bookData);
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
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  if (error)
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>An error occurred</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%",
            marginTop: 10,
          }}
        >
          <Button
            color={GenericColors.blue}
            onPress={refetch}
            title="Retry"
            type="text"
          />
          <Button
            color={GenericColors.yellow}
            onPress={() => router.navigate("/")}
            title="Go Home"
          />
        </View>
      </ThemedView>
    );

  const imageUri =
    book?.volumeInfo?.imageLinks?.large ||
    book?.volumeInfo?.imageLinks?.medium ||
    book?.volumeInfo?.imageLinks?.thumbnail ||
    "https://via.placeholder.com/150";

  const sourceDescription = {
    html: book?.volumeInfo.description || "",
  };

  return (
    <ThemedSafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ThemedScrollView>
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ height: 400, width: 300, borderRadius: 15 }}
          />
          <ThemedText
            style={{
              marginTop: 10,
              fontSize: Platform.OS === "web" ? 30 : 20,
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 10,
              fontFamily: "Avenir",
            }}
          >
            {book?.volumeInfo?.title}
          </ThemedText>
          <ThemedText
            style={{
              textAlign: "center",
              marginBottom: 5,
              fontFamily: "Open Sans",
              fontSize: 20,
              maxWidth: 300,
            }}
          >
            <Text style={{ color: `${GenericColors.black}50` }}>by</Text>{" "}
            {book?.volumeInfo?.authors?.join(", ")}
          </ThemedText>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
            }}
          >
            {book?.saleInfo?.buyLink && (
              <Button
                color={GenericColors.purple}
                title="Purchase"
                onPress={() => {
                  if (book?.saleInfo?.buyLink) {
                    Linking.openURL(book.saleInfo.buyLink);
                  }
                }}
              />
            )}
            <Button
              color={GenericColors.blue}
              onPress={handleAddToReadingGroupPress}
              svg={
                isReadingGroup ? (
                  <BookmarkSolidSvg
                    color={GenericColors.blue}
                    height={24}
                    width={24}
                  />
                ) : (
                  <BookmarkOutlineSvg
                    color={GenericColors.blue}
                    height={24}
                    width={24}
                  />
                )
              }
            />
            <Button
              color={GenericColors.green}
              onPress={handleWishlistPress}
              svg={
                isWishlist ? (
                  <StarSolidSvg
                    color={GenericColors.green}
                    height={24}
                    width={24}
                  />
                ) : (
                  <StarOutlineSvg
                    color={GenericColors.green}
                    height={24}
                    width={24}
                  />
                )
              }
            />
          </View>

          {book?.volumeInfo.description && (
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 10,
                maxWidth: 400,
                alignSelf: "center",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "left",
                  marginBottom: 10,
                  fontFamily: "Avenir",
                }}
              >
                About
              </ThemedText>
              <RenderHtml
                defaultTextProps={{
                  style: {
                    fontSize: 16,
                    fontFamily: "Open Sans",
                    color,
                  },
                }}
                contentWidth={width}
                source={sourceDescription}
              />
            </View>
          )}
        </ThemedView>
      </ThemedScrollView>
    </ThemedSafeAreaView>
  );
};

export default Detail;
