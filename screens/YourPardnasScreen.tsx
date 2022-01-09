import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../lib/tailwind";
import { PARDNAS_QUERY } from "../apollo/queries";
import { AuthContext } from "../contexts/auth";
import { RootTabScreenProps } from "../types";
import format from "date-fns/format";

const YourPardnasScreen = ({
  navigation,
}: RootTabScreenProps<"YourPardnas">) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    data: { pardnas } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARDNAS_QUERY, {
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  if (!pardnas) {
    return null;
  }

  return (
    <SafeAreaView style={tw.style("h-full p-4 bg-gray-50")}>
      <View>
        {pardnas.map(
          ({
            id,
            name,
            startDate,
            participants,
          }: {
            id: string;
            name: string;
            startDate: Date;
            participants: any[];
          }) => (
            <View style={tw.style("bg-white rounded-lg shadow")} key={id}>
              <View
                style={tw.style("flex-row items-center justify-between p-6")}
              >
                <View style={tw.style("")}>
                  <Text style={tw.style("text-gray-900 text-sm font-medium")}>
                    {name}
                  </Text>
                  <Text style={tw.style("mt-1 text-gray-500 text-sm")}>
                    Starting {format(startDate, "EEEE do MMM yyyy")}
                  </Text>
                </View>
                <Text style={tw.style("mt-1 text-gray-500 text-sm")}>
                  {participants.length} participant
                  {participants.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          ),
        )}
      </View>
    </SafeAreaView>
  );
};

export default YourPardnasScreen;
