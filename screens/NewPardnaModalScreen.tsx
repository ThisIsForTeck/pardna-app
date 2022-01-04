import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import NewPardnaForm from "../components/forms/NewPardnaForm/NewPardnaForm";

const NewSparkModalScreen = () => {
  return (
    <View>
      <View>
        <Text>New Pardna</Text>
      </View>
      <NewPardnaForm />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default NewSparkModalScreen;
