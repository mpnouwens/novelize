import { AudioFile, Book } from "@/types";
import React, { ReactNode, createContext, useEffect, useState } from "react";

import { Audio } from "expo-av";

interface AudioContextType {
  selectedAudio: AudioFile | null;
  bookDetails: Book | null;
  isPlaying: boolean;
  playAudio: (audio: AudioFile) => Promise<void>;
  pauseAudio: () => Promise<void>;
  setBookDetails: (book: Book) => void;
  closeAudio: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | null>(null);
  const [bookDetails, setBookDetails] = useState<Book | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async (audio: AudioFile) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audio.url,
    });
    setSound(newSound);
    setSelectedAudio(audio);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  const pauseAudio = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    }
  };

  const closeAudio = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setSelectedAudio(null);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        selectedAudio,
        bookDetails,
        isPlaying,
        playAudio,
        pauseAudio,
        setBookDetails,
        closeAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
