import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../lib/tailwind";
import CreatePardnaForm from "../components/forms/CreatePardnaForm/CreatePardnaForm";

const NewSparkModalScreen = () => {
  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
      <View>
        <Text
          style={tw`mb-6 text-center text-3xl font-extrabold text-gray-900`}
        >
          Create a new Pardna
        </Text>
        <CreatePardnaForm />
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </SafeAreaView>
  );
};

export default NewSparkModalScreen;
