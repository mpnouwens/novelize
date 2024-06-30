import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import AudioPlayer from "@/components/AudioPlayer";
import { AudioProvider } from "@/context/AudioContext";
import { DatabaseProvider } from "@/context/DatabaseContext";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DatabaseProvider>
        <ReactQueryClientProvider>
          <AudioProvider>
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <AudioPlayer />
            </SafeAreaProvider>
          </AudioProvider>
        </ReactQueryClientProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}
