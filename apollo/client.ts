import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://api.pardnapp.com/graphql",
  // uri: "http://localhost:3000/graphql/dev",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync("userToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    // defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
  });
};
