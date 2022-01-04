import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Text>Register screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
