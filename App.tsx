import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import { QueryClient, QueryClientProvider } from "react-query";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { AuthContextProvider } from "./contexts/auth";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // Create a client
  const queryClient = new QueryClient();

  if (!isLoadingComplete) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <Navigation colorScheme={colorScheme} />
          </AuthContextProvider>
        </QueryClientProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
