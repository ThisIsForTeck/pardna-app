import * as React from "react";
import { Text, View } from "react-native";

import { PardnaStackScreenProps } from "../types";

const PardnaScreen = ({
  navigation,
  route,
}: PardnaStackScreenProps<"Pardna">) => {
  return (
    <View>
      <Text>Pardna: {route.params?.id}</Text>
    </View>
  );
};

export default PardnaScreen;
