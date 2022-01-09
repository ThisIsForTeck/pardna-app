/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { ColorSchemeName, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWallet, faPlusCircle } from "@fortawesome/pro-regular-svg-icons";
import { AuthContext } from "../contexts/auth";
import NotFoundScreen from "../screens/NotFoundScreen";
import YourPardnasScreen from "../screens/YourPardnasScreen";
import NewPardnaScreen from "../screens/NewPardnaScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import LogInScreen from "../screens/LogInScreen";
import NewPardnaModalScreen from "../screens/NewPardnaModalScreen";
import tw from "../lib/tailwind";

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;

      try {
        token = await SecureStore.getItemAsync("userToken");
        console.log({ token });
      } catch (e) {
        // restoring token failed
        console.error({ e });
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token });
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken === null ? (
        <Stack.Screen
          name="LogIn"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              name="NewPardnaModal"
              component={NewPardnaModalScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { logOut } = useContext(AuthContext);

  return (
    <BottomTab.Navigator
      initialRouteName="YourPardnas"
      screenOptions={{
        tabBarStyle: {
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          paddingBottom: 8,
        },
        headerRight: () => (
          <Text style={tw.style("px-4")} onPress={logOut}>
            Log out
          </Text>
        ),
      }}
    >
      <BottomTab.Screen
        name="YourPardnas"
        component={YourPardnasScreen}
        options={({ navigation }: RootTabScreenProps<"YourPardnas">) => ({
          title: "Pardnas",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faWallet} size={24} color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="NewPardna"
        component={NewPardnaScreen}
        options={{
          title: "New",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faPlusCircle} size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("NewPardnaModal");
          },
        })}
      />
    </BottomTab.Navigator>
  );
}

export default Navigation;
