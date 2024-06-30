import { Book } from "@/types";
import { Platform } from "react-native";
import axios from "axios";

export const getAssistantSummary = async (book: Book | undefined) => {
  if (!book) {
    return;
  }

  const isbn = book?.volumeInfo.industryIdentifiers?.find(
    (identifier) => identifier.type === "ISBN_13"
  )?.identifier;

  const data = {
    title: book.volumeInfo.title ? book.volumeInfo.title : "No title",
    isbn,
    authors: book.volumeInfo.authors ? book.volumeInfo.authors : "No Authors",
    publisher: book.volumeInfo.publisher
      ? book.volumeInfo.publisher
      : "No publisher",
    description: book.volumeInfo.description
      ? book.volumeInfo.description
      : "No Description",
  };

  console.log("data", data);

  try {
    const response = await axios.post(
      Platform.OS === "web"
        ? `/chat/api/${book.id}`
        : `https://novelize.netlify.app/chat/api/${book.id}`,
      data
    );

    console.log("response", response);

    return response.data;
  } catch (error) {
    console.error("Error posting book data", error);
  }
};

export const createAssistantAudio = async (bookId: string, message: string) => {
  if (!bookId || !message) {
    return;
  }

  const response = await axios.post(
    Platform.OS === "web"
      ? `/audio/api/${bookId}`
      : `https://novelize.netlify.app/audio/api/${bookId}`,
    {
      message,
    }
  );

  return response.data;
};
