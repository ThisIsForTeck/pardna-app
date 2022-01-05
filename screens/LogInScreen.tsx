import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Headline } from "react-native-paper";
import LogInForm from "../components/forms/LogInForm/LogInForm";

const LogInScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <Headline>Log in</Headline>
      <LogInForm />
    </SafeAreaView>
  );
};

export default LogInScreen;
