import { DatabaseProvider } from "@/context/DatabaseContext";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <ReactQueryClientProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </ReactQueryClientProvider>
    </DatabaseProvider>
  );
}
