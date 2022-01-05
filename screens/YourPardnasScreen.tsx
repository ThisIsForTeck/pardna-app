import { View, Text } from "react-native";
import { RootTabScreenProps } from "../types";

const YourPardnasScreen = ({
  navigation,
}: RootTabScreenProps<"YourPardnas">) => {
  return (
    <View>
      <Text>Your Pardnas</Text>
    </View>
  );
};

export default YourPardnasScreen;
