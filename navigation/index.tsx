/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { ColorSchemeName, Pressable, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import Colors from "../constants/Colors";
import { AuthContext } from "../contexts/auth";
import useColorScheme from "../hooks/useColorScheme";
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
  const colorScheme = useColorScheme();
  const { logOut } = useContext(AuthContext);

  return (
    <BottomTab.Navigator
      initialRouteName="YourPardnas"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerRight: () => <Text onPress={logOut}>Log out</Text>,
      }}
    >
      <BottomTab.Screen
        name="YourPardnas"
        component={YourPardnasScreen}
        options={({ navigation }: RootTabScreenProps<"YourPardnas">) => ({
          title: "Your Pardnas",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-ul" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="NewPardna"
        component={NewPardnaScreen}
        options={{
          title: "New Pardna",
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} {...props} />;
}

export default Navigation;
