import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import LogInForm from "../components/forms/LogInForm/LogInForm";

const LogInScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Text>
          Please check your email address and enter the PIN code you were sent
          to start using Sparks
        </Text>
      </View>
      <LogInForm />
    </SafeAreaView>
  );
};

export default LogInScreen;
