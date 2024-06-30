import { AudioFile, Book } from "@/types";
import { Pressable, View } from "react-native";
import React, { FC, useMemo } from "react";
import {
  createAssistantAudio,
  getAssistantSummary,
} from "../utils/getAssistantSummary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "./Button";
import { Collapsible } from "./Collapsible";
import { GenericColors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { fetchGeneratedAudioFiles } from "@/utils/fetchGeneratedAudioFiles";
import { useAudio } from "@/hooks/useAudio";

interface CreateAssistantAudioProps {
  book: Book | undefined;
}

const CreateAssistantAudio: FC<CreateAssistantAudioProps> = ({ book }) => {
  const queryClient = useQueryClient();
  const { playAudio, setBookDetails } = useAudio();

  const { mutate: createAudioFileMutation, status: createAudioFileStatus } =
    useMutation({
      mutationKey: ["createAudioFile", book],
      mutationFn: (assistantMessage: string) =>
        book
          ? createAssistantAudio(book.id, assistantMessage)
          : Promise.reject("Book ID is undefined"),
      onSuccess: (file) => {
        queryClient.invalidateQueries({
          queryKey: ["fetchGeneratedAudioFiles"],
        });
      },
      onError: () => {
        console.error("Error creating audio file:");
      },
    });

  const { mutate: getSummaryMutation, status: getSummaryStatus } = useMutation({
    mutationFn: () => getAssistantSummary(book),
    onSuccess: async (message: string) => {
      await createAudioFileMutation(message);
    },
    onError: () => {
      console.error("Error getting summary:");
    },
  });

  const fetchGeneratedAudioContent = useMemo(
    () => ({
      queryKey: ["fetchGeneratedAudioFiles", book?.id],
      queryFn: () =>
        book?.id
          ? fetchGeneratedAudioFiles(book?.id.toString())
          : Promise.reject("ID is undefined"),
      enabled: !!book?.id,
    }),
    [book?.id]
  );

  const {
    isLoading: isLoadingAudios,
    error: errorAudios,
    data: audios,
  } = useQuery<AudioFile[]>(fetchGeneratedAudioContent);

  // WIP: Adding loading and updated UI
  console.log({
    isLoadingAudios,
    errorAudios,
    audios,
  });

  const handleGetSummary = () => {
    getSummaryMutation();
  };

  const handleSelectAudio = async (audio: AudioFile) => {
    if (!book) {
      return;
    }

    setBookDetails(book);
    playAudio(audio);
  };

  if (!book) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Button
          color={GenericColors.pink}
          onPress={handleGetSummary}
          title="Ask AI"
          isLoading={
            createAudioFileStatus === "pending" ||
            getSummaryStatus === "pending"
          }
        />
        {audios && audios?.length > 0 && (
          <Collapsible title="Generated Audio Files">
            {audios.map((audio) => (
              <ThemedView key={`${audio.name}`}>
                <Pressable
                  onPress={() => handleSelectAudio(audio)}
                  style={{
                    padding: 10,
                    backgroundColor: GenericColors.grey,
                    margin: 5,
                  }}
                >
                  <ThemedText>{audio.name}</ThemedText>
                </Pressable>
              </ThemedView>
            ))}
          </Collapsible>
        )}
      </View>
    </View>
  );
};

export default CreateAssistantAudio;
