import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../lib/tailwind";
import { PARDNAS_QUERY } from "../apollo/queries";
import { AuthContext } from "../contexts/auth";
import format from "date-fns/format";
import Loader from "../components/Loader/Loader";
import Error from "../components/Error/Error";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar, faUsers } from "@fortawesome/pro-regular-svg-icons";

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
    return <Loader dataType="Pardnas" />;
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
    return <Error dataType="Pardnas" />;
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
                  <Text style={tw`text-gray-900 text-lg font-bold`}>
                    {name}
                  </Text>
                  <View
                    style={tw`flex-row items-center mt-2 text-gray-500 text-sm`}
                  >
                    <FontAwesomeIcon
                      icon={faCalendar}
                      size={20}
                      style={tw`mr-2 text-gray-500`}
                    />
                    <Text style={tw``}>
                      {format(startDate, "EEEE do MMM yyyy")}
                    </Text>
                  </View>
                </View>
                <View style={tw`flex-row items-center`}>
                  <FontAwesomeIcon
                    icon={faUsers}
                    size={20}
                    style={tw`mr-2 text-gray-500`}
                  />
                  <Text style={tw`mt-1 text-gray-500 text-sm`}>
                    {participants.length}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ),
        )}
      </View>
    </SafeAreaView>
  );
};

export default YourPardnasScreen;
