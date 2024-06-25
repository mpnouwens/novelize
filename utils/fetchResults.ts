import { Platform } from "react-native";
import axios from "axios";

export const fetchSearchResults = async (
  search: string,
  startIndex: number = 0
) => {
  console.log("startindex", startIndex);
  const response = await axios.get(
    Platform.OS === "web"
      ? `/search/api/${search}?startIndex=${startIndex}`
      : `https://novelize.netlify.app/search/api/${search}?startIndex=${startIndex}`
  );
  return response.data;
};
