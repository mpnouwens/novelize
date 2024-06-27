import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DatabaseProvider } from "@/context/DatabaseContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <DatabaseProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </QueryClientProvider>
    </DatabaseProvider>
  );
}
