import * as Linking from "expo-linking";

import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
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
import { MaturityRating } from "@/constants";
import RenderHtml from "react-native-render-html";
import { StarOutlineSvg } from "@/assets/svgs/StarOutlineSvg";
import { StarSolidSvg } from "@/assets/svgs/StarSolidSvg";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchSingleBook } from "@/utils/fetchSingleBook";
import { formatDate } from "@/utils/formatDate";
import { getReadableMaturityRating } from "@/utils/getReadableMaturityRating";
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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GenericColors.blue} />
      </ThemedView>
    );

  if (error)
    return (
      <ThemedView style={styles.errorContainer}>
        <Text>An error occurred</Text>
        <View style={styles.errorActions}>
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
    <ThemedSafeAreaView style={styles.container}>
      <ThemedScrollView>
        <ThemedView style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.bookImage} />
            {book?.volumeInfo.averageRating && (
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>
                  {book?.volumeInfo.averageRating} ⭐
                </Text>
              </View>
            )}
          </View>

          <ThemedText style={styles.bookTitle}>
            {book?.volumeInfo?.title}
          </ThemedText>
          <ThemedText style={styles.bookAuthors}>
            <Text style={styles.byText}>by</Text>{" "}
            {book?.volumeInfo?.authors?.join(", ")}
          </ThemedText>
          <ThemedText style={styles.bookPublisher}>
            {book?.volumeInfo?.publisher},{" "}
            {formatDate(book?.volumeInfo?.publishedDate)}
          </ThemedText>
          <View style={styles.bookMaturityContainer}>
            <ThemedText style={styles.bookMaturity}>
              {getReadableMaturityRating(
                book?.volumeInfo.maturityRating as MaturityRating
              )}
            </ThemedText>
          </View>

          <View style={styles.buttonRow}>
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
            <View style={styles.descriptionContainer}>
              <ThemedText style={styles.aboutHeader}>About</ThemedText>
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

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  bookImage: {
    width: 300,
    height: 400,
    borderRadius: 15,
  },
  ratingPill: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  ratingText: {
    color: GenericColors.white,
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  bookAuthors: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
  },
  byText: {
    fontStyle: "italic",
  },
  bookPublisher: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  bookMaturityContainer: {
    backgroundColor: GenericColors.grey,
    borderRadius: 20, // More pronounced pill shape
    paddingHorizontal: 12, // Wider for a better pill effect
    paddingVertical: 3, // Reduced to make the pill sleeker
    marginVertical: 10, // Adjusted for better spacing
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // For Android shadow
  },

  bookMaturity: {
    color: GenericColors.white,
    fontSize: 14, // Slightly smaller for a better fit
    fontWeight: "bold", // Make text stand out
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    maxWidth: 400,
    alignSelf: "center",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    fontFamily: "Avenir",
  },
});

export default Detail;
