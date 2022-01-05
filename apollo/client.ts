import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = () => {
  return new ApolloClient({
    uri: "https://api.pardnapp.com/graphql",
    cache: new InMemoryCache(),
    // defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
  });
};
