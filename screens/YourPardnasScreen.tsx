import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../lib/tailwind";
import { PARDNAS_QUERY } from "../apollo/queries";
import { AuthContext } from "../contexts/auth";
import { RootTabScreenProps } from "../types";
import format from "date-fns/format";

const YourPardnasScreen = ({ navigation }) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    loading,
    error,
    data: { pardnas } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARDNAS_QUERY, {
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  if (loading) {
    return (
      <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
        <View>
          <Text style={tw`text-gray-900 text-sm font-medium`}>
            Fetching Pardnas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && !error && !pardnas.length) {
    return (
      <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
        <View>
          <Text style={tw`text-gray-900 text-sm font-medium`}>
            You dont have any Pardnas yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
        <View>
          <Text style={tw`text-gray-900 text-sm font-medium`}>
            You dont have any Pardnas yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
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
            <TouchableOpacity
              style={tw`bg-white rounded-lg shadow`}
              key={id}
              onPress={() =>
                navigation.navigate("Pardna", {
                  id,
                })
              }
            >
              <View style={tw`flex-row items-center justify-between p-6`}>
                <View>
                  <Text style={tw`text-gray-900 text-sm font-medium`}>
                    {name}
                  </Text>
                  <Text style={tw`mt-1 text-gray-500 text-sm`}>
                    Starting {format(startDate, "EEEE do MMM yyyy")}
                  </Text>
                </View>
                <Text style={tw`mt-1 text-gray-500 text-sm`}>
                  {participants.length} participant
                  {participants.length === 1 ? "" : "s"}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        )}
      </View>
    </SafeAreaView>
  );
};

export default YourPardnasScreen;
