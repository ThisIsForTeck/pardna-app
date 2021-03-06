import React, { createContext, ReactElement, useMemo, useReducer } from "react";
import { useApolloClient } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { LOGIN_MUTATION, CREATE_USER_MUTATION } from "../apollo/queries";

type logInProps = {
  email: string;
  password: string;
};

type signUpProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthContextProps = {
  logIn: ({ email, password }: logInProps) => void;
  logOut: () => void;
  signUp: ({ firstName, lastName, email, password }: signUpProps) => void;
  state: {
    isLoading: boolean;
    isSignout: boolean;
    userToken?: string;
  };
  dispatch: (payload: any) => void;
};

export type AuthContextProviderProps = { children: ReactElement };

export const AuthContext = createContext<AuthContextProps>({
  logIn: () => null,
  logOut: () => null,
  signUp: () => null,
  state: {
    isLoading: true,
    isSignout: false,
    userToken: undefined,
  },
  dispatch: () => null,
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const client = useApolloClient();
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  const context = useMemo(
    () => ({
      logIn: async ({ email, password }: logInProps) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        // manually firing off mutation and pull id from response
        const {
          data: {
            logIn: { token },
          },
        } = await client.mutate({
          mutation: LOGIN_MUTATION,
          variables: { email, password },
        });

        await SecureStore.setItemAsync("userToken", token);

        dispatch({ type: "SIGN_IN", token });
      },
      logOut: async () => {
        await SecureStore.deleteItemAsync("userToken");

        // clear caches of query results
        client.clearStore();

        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async ({ firstName, lastName, email, password }: signUpProps) => {
        try {
          // manually firing off mutation and pull id from response
          const {
            data: {
              createUser: { token },
            },
          } = await client.mutate({
            mutation: CREATE_USER_MUTATION,
            variables: { firstName, lastName, email, password },
          });

          await SecureStore.setItemAsync("userToken", token);

          dispatch({ type: "SIGN_IN", token });
        } catch (error) {
          console.error({ error });
        }
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        ...context,
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
