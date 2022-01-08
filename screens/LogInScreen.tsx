import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import LogInForm from "../components/forms/LogInForm/LogInForm";
import tw from "../lib/tailwind";

const LogInScreen = () => {
  return (
    <SafeAreaView style={tw.style("h-full p-4 bg-gray-50")}>
      <StatusBar />
      <View style={tw.style("mt-8 sm:mx-auto sm:w-full sm:max-w-md")}>
        <View style={tw.style("bg-white p-8 shadow rounded")}>
          <Text
            style={tw.style(
              "mb-6 text-center text-3xl font-extrabold text-gray-900",
            )}
          >
            Pardna
          </Text>
          <LogInForm />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogInScreen;
