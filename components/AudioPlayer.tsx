import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC } from "react";

import { GenericColors } from "@/constants/Colors";
import { useAudio } from "@/context/AudioContext";

const AudioPlayer: FC = () => {
  const { selectedAudio, bookDetails, isPlaying, playAudio, pauseAudio } =
    useAudio();

  if (!selectedAudio || !bookDetails) {
    return null;
  }

  const isMobile = Dimensions.get("window").width < 768;

  return (
    <View
      style={[
        styles.playerContainer,
        isMobile ? styles.mobilePlayer : styles.desktopPlayer,
      ]}
    >
      <Image
        source={{ uri: bookDetails.volumeInfo.imageLinks.thumbnail }}
        style={styles.coverImage}
      />
      <Pressable
        onPress={isPlaying ? pauseAudio : () => playAudio(selectedAudio)}
        style={styles.playPauseButton}
      >
        <Text style={styles.playPauseText}>{isPlaying ? "Pause" : "Play"}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  playPauseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: GenericColors.pink,
    borderRadius: 10,
  },
  playPauseText: {
    color: GenericColors.white,
    fontSize: 16,
  },
});

export default AudioPlayer;
