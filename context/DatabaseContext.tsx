import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedBook } from "@/types";

interface DatabaseContextType {
  addWishList: (book: SavedBook) => Promise<void>;
  removeWishList: (ISBN: string) => Promise<void>;
  getWishLists: () => Promise<SavedBook[]>;
  addReadingGroup: (groupId: string) => Promise<void>;
  removeReadingGroup: (groupId: string) => Promise<void>;
  getReadingGroups: () => Promise<string[]>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "wishlist";
const READING_GROUP_STORAGE_KEY = "readingGroups";

export const DatabaseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [wishLists, setWishLists] = useState<SavedBook[]>([]);
  const [readingGroups, setReadingGroups] = useState<string[]>([]);

  useEffect(() => {
    const loadWishLists = async () => {
      const storedWishLists = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishLists) {
        setWishLists(JSON.parse(storedWishLists));
      }
    };

    const loadReadingGroups = async () => {
      const storedReadingGroups = await AsyncStorage.getItem(
        READING_GROUP_STORAGE_KEY
      );
      if (storedReadingGroups) {
        setReadingGroups(JSON.parse(storedReadingGroups));
      }
    };

    loadWishLists();
    loadReadingGroups();
  }, []);

  const addWishList = async (book: SavedBook) => {
    const exists = wishLists.some((wish) => wish.ISBN === book.ISBN);
    if (!exists) {
      const newWishLists = [...wishLists, book];
      setWishLists(newWishLists);
      await AsyncStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(newWishLists)
      );
    }
  };

  const removeWishList = async (ISBN: string) => {
    const newWishLists = wishLists.filter((book) => book.ISBN !== ISBN);
    setWishLists(newWishLists);
    await AsyncStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(newWishLists)
    );
  };

  const getWishLists = async () => {
    return wishLists;
  };

  const addReadingGroup = async (groupId: string) => {
    const exists = readingGroups.includes(groupId);
    if (!exists) {
      const newReadingGroups = [...readingGroups, groupId];
      setReadingGroups(newReadingGroups);
      await AsyncStorage.setItem(
        READING_GROUP_STORAGE_KEY,
        JSON.stringify(newReadingGroups)
      );
    }
  };

  const removeReadingGroup = async (groupId: string) => {
    const newReadingGroups = readingGroups.filter((group) => group !== groupId);
    setReadingGroups(newReadingGroups);
    await AsyncStorage.setItem(
      READING_GROUP_STORAGE_KEY,
      JSON.stringify(newReadingGroups)
    );
  };

  const getReadingGroups = async () => {
    return readingGroups;
  };

  return (
    <DatabaseContext.Provider
      value={{
        addWishList,
        removeWishList,
        getWishLists,
        addReadingGroup,
        removeReadingGroup,
        getReadingGroups,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
