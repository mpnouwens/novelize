import { Button } from "@/components/Button";
import { Image } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

export default function Books() {
  const router = useRouter();

  return (
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
      <ThemedView
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
      </ThemedView>
    </ThemedView>
  );
}
