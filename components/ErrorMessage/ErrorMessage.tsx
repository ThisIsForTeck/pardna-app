import { Text, View } from "react-native";
import tw from "../../lib/tailwind";

const ErrorMessage = ({ text }: { text?: string }) => (
  <View style={tw`p-4 bg-red-500 rounded mt-2`}>
    <Text style={tw`text-white text-sm font-medium`}>{text}</Text>
  </View>
);

export default ErrorMessage;
