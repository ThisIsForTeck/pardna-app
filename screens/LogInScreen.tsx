import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LogInForm from "../components/forms/LogInForm/LogInForm";
import tw from "../lib/tailwind";

const LogInScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
      <StatusBar />
      <View style={tw`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
        <View style={tw`bg-white p-8 shadow rounded`}>
          <Text
            style={tw`mb-6 text-center text-3xl font-extrabold text-gray-900`}
          >
            Pardna
          </Text>
          <LogInForm />
        </View>
        <View style={tw`mt-8 bg-white p-8 shadow rounded`}>
          <Text style={tw`text-sm text-center`}>
            Don't have an account?{" "}
            <Text
              style={tw` text-indigo-600 font-medium`}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogInScreen;
