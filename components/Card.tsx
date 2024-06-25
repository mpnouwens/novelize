import { Image, Text, View } from "react-native";
import React, { FC } from "react";

import { Book } from "../types";

const Card: FC<{ book: Book }> = ({ book }) => (
  <View
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
            {book?.volumeInfo?.title || "Title not available"}
          </Text>
          <Text style={{ textAlign: "left", marginBottom: 5 }}>
            <Text style={{ color: "#858585" }}>by</Text>{" "}
            {book?.volumeInfo.authors?.length > 0
              ? book.volumeInfo.authors.join(", ")
              : "Author(s) not available"}
          </Text>
          <Text style={{ textAlign: "left" }}>
            {book?.volumeInfo.description
              ? book.volumeInfo.description.length > 100
                ? `${book.volumeInfo.description.slice(0, 50)}...`
                : book.volumeInfo.description
              : "Description not available"}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export { Card };
