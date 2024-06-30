import { Platform } from "react-native";
import axios from "axios";

export const fetchGeneratedAudioFiles = async (id: string | undefined) => {
  if (!id) {
    return;
  }

  const response = await axios.get(
    Platform.OS === "web"
      ? `/audio/api/${id}`
      : `https://novelize.netlify.app/audio/api/${id}`
  );

  return response.data;
};
