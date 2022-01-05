import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import { ApolloProvider } from "@apollo/client";
import { Provider as PaperProvider } from "react-native-paper";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { createApolloClient } from "./apollo/client";
import Navigation from "./navigation";
import { AuthContextProvider } from "./contexts/auth";

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const client = createApolloClient();

  if (!isLoadingComplete) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <AuthContextProvider>
          <PaperProvider>
            <Navigation colorScheme={colorScheme} />
          </PaperProvider>
        </AuthContextProvider>
      </ApolloProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export default App;
