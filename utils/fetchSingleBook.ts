import { Platform } from "react-native";
import axios from "axios";

export const fetchSingleBook = async (id: string) => {
  const response = await axios.get(
    Platform.OS === "web"
      ? `/detail/api/${id}`
      : `https://novelize.netlify.app/detail/api/${id}`
  );

  return response.data;
};
