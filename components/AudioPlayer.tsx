import { GenericColors, colorSlugs } from "@/constants/Colors";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC } from "react";

import { useAudio } from "@/hooks/useAudio";
import { useThemeColor } from "@/hooks/useThemeColor";

const AudioPlayer: FC = () => {
  const backgroundColor = useThemeColor({}, colorSlugs.background);

  const {
    selectedAudio,
    bookDetails,
    isPlaying,
    playAudio,
    pauseAudio,
    closeAudio,
  } = useAudio();

  if (!selectedAudio || !bookDetails) {
    return null;
  }

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  return (
    <View
      style={[
        styles.playerContainer,
        isMobile ? styles.mobilePlayer : styles.desktopPlayer,
        {
          backgroundColor: isMobile ? backgroundColor : "rgba(0, 0, 0, 0.7)",
          borderColor: isMobile ? `${GenericColors.grey}50` : "transparent",
          borderWidth: isMobile ? 1 : 0,
          alignSelf: isMobile ? "center" : "flex-end",
        },
      ]}
    >
      <Image
        source={{ uri: bookDetails.volumeInfo.imageLinks.thumbnail }}
        style={[
          styles.coverImage,
          {
            width: isMobile ? 55 : 100,
            height: isMobile ? 55 : 100,
          },
        ]}
      />

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={closeAudio}
          style={[
            styles.stopButton,
            {
              marginTop: isMobile ? 0 : 10,
            },
          ]}
        >
          <Text style={styles.stopText}>Close</Text>
        </Pressable>
        <Pressable
          onPress={isPlaying ? pauseAudio : () => playAudio(selectedAudio)}
          style={[
            styles.playPauseButton,
            {
              marginTop: isMobile ? 0 : 10,
            },
          ]}
        >
          <Text style={styles.playPauseText}>
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  desktopPlayer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  mobilePlayer: {
    height: 65,
    position: "absolute",
    top: "6.5%",
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 50,
  },
  coverImage: {
    borderRadius: 10,
  },
  playPauseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: GenericColors.pink,
    borderRadius: 10,
    minHeight: 40,
  },
  playPauseText: {
    color: GenericColors.white,
    fontSize: 16,
  },
  stopButton: {
    padding: 10,
    backgroundColor: GenericColors.red,
    borderRadius: 10,
    marginRight: 10,
    minHeight: 40,
  },
  stopText: {
    color: GenericColors.white,
    fontSize: 16,
  },
});

export default AudioPlayer;
