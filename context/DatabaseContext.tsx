import React, {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedBook } from "@/types";

interface DatabaseContextType {
  addWishList: (book: SavedBook) => Promise<void>;
  removeWishList: (id: string) => Promise<void>;
  getWishList: () => Promise<SavedBook[]>;
  addReadingGroup: (book: SavedBook) => Promise<void>;
  removeReadingGroup: (id: string) => Promise<void>;
  getReadingGroup: () => Promise<SavedBook[]>;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "wishlist";
const READING_GROUP_STORAGE_KEY = "readingGroups";

export const DatabaseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [wishLists, setWishLists] = useState<SavedBook[]>([]);
  const [readingGroup, setReadingGroup] = useState<SavedBook[]>([]);

  useEffect(() => {
    const loadWishLists = async () => {
      const storedWishLists = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishLists) {
        setWishLists(JSON.parse(storedWishLists));
      }
    };

    const loadReadingGroup = async () => {
      const storedReadingGroup = await AsyncStorage.getItem(
        READING_GROUP_STORAGE_KEY
      );
      if (storedReadingGroup) {
        setReadingGroup(JSON.parse(storedReadingGroup));
      }
    };

    loadWishLists();
    loadReadingGroup();
  }, []);

  const addWishList = async (book: SavedBook) => {
    const exists = wishLists.some((wish) => wish.id === book.id);
    if (!exists) {
      const newWishLists = [...wishLists, book];
      setWishLists(newWishLists);
      await AsyncStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(newWishLists)
      );
    }
  };

  const removeWishList = async (id: string) => {
    const newWishLists = wishLists.filter((book) => book.id !== id);
    setWishLists(newWishLists);
    await AsyncStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(newWishLists)
    );
  };

  const getWishList = async () => {
    return wishLists;
  };

  const addReadingGroup = async (book: SavedBook) => {
    const exists = wishLists.some((g) => g.id === book.id);
    if (!exists) {
      const newReadingGroup = [...readingGroup, book];
      setReadingGroup(newReadingGroup);
      await AsyncStorage.setItem(
        READING_GROUP_STORAGE_KEY,
        JSON.stringify(newReadingGroup)
      );
    }
  };

  const removeReadingGroup = async (bookId: string) => {
    const newReadingGroup = readingGroup.filter((book) => book.id !== bookId);
    setReadingGroup(newReadingGroup);
    await AsyncStorage.setItem(
      READING_GROUP_STORAGE_KEY,
      JSON.stringify(newReadingGroup)
    );
  };

  const getReadingGroup = async () => {
    return readingGroup;
  };
  return (
    <DatabaseContext.Provider
      value={{
        addWishList,
        removeWishList,
        getWishList,
        addReadingGroup,
        removeReadingGroup,
        getReadingGroup,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
