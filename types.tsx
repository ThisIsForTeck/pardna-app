/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  LogIn: undefined;
  SignUp: undefined;
  NewPardnaModal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  YourPardnas: undefined;
  NewPardna: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type PardnaStackParamList = {
  Root: undefined;
  Pardna: undefined;
  Participant: undefined;
  Payment: undefined;
  EditParticipant: undefined;
  EditPardna: undefined;
};

export type PardnaStackScreenProps<Screen extends keyof PardnaStackParamList> =
  NativeStackScreenProps<PardnaStackParamList, Screen>;
