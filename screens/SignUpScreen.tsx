import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SignUpForm from "../components/forms/SignUpForm/SignUpForm";
import tw from "../lib/tailwind";

const SignUpScreen = () => {
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
          <SignUpForm />
        </View>
        <View style={tw`mt-8 bg-white p-8 shadow rounded`}>
          <Text style={tw`text-sm text-center`}>
            Have an account?{" "}
            <Text
              style={tw` text-indigo-600 font-medium`}
              onPress={() => navigation.navigate("LogIn")}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
