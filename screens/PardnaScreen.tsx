import * as React from "react";
import { Text, View, FlatList } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import tw from "../lib/tailwind";
import { PardnaStackScreenProps } from "../types";
import {
  PARDNA_QUERY,
  PARDNAS_QUERY,
  DELETE_PARDNA_MUTATION,
} from "../apollo/queries";
import { AuthContext } from "../contexts/auth";
import Loader from "../components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAlarmClock,
  faCalendar,
  faCoins,
  faPiggyBank,
} from "@fortawesome/pro-regular-svg-icons";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

type ItemProps = {
  data: {
    id: string;
    name: string;
    email: string;
  };
};

const Item = ({ data: { id, name, email } }: ItemProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={tw`bg-white p-6 mb-4 flex-row justify-between`}
      onPress={() =>
        navigation.navigate("Participant", {
          id,
        })
      }
      key={id}
    >
      <Text>{name}</Text>
      <Text>{email}</Text>
    </TouchableOpacity>
  );
};

const PardnaScreen = ({
  navigation,
  route,
}: PardnaStackScreenProps<"Pardna">) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    loading,
    error,
    data: { pardna } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARDNA_QUERY, {
    variables: { id: route.params?.id },
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  const [deletePardna] = useMutation(DELETE_PARDNA_MUTATION, {
    refetchQueries: [PARDNAS_QUERY],
  });

  if (loading) return <Loader dataType="Pardna" />;

  if (error)
    return (
      <View>
        <Text>An error happened trying to fetch the Pardna</Text>
      </View>
    );

  if (!pardna) return null;

  const {
    id,
    name,
    startDate,
    endDate,
    contributionAmount,
    bankerFee,
    participants,
    ledger: { paymentFrequency } = {},
  } = pardna;

  const renderItem = ({ item }) => <Item data={item} />;

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50`}>
      <View style={tw`bg-white p-6`}>
        <View style={tw`mb-12`}>
          <Text style={tw`text-3xl font-bold text-center mb-8`}>{name}</Text>
          <View style={tw`flex-row items-center text-gray-500 text-sm mb-2`}>
            <FontAwesomeIcon
              icon={faCalendar}
              size={20}
              style={tw`mr-2 text-gray-600`}
            />
            <Text style={tw``}>
              Starts {format(startDate, "EEEE do MMM yyyy")}
            </Text>
          </View>
          <View
            style={tw`flex-row items-center mt-2 text-gray-500 text-sm mb-2`}
          >
            <FontAwesomeIcon
              icon={faAlarmClock}
              size={20}
              style={tw`mr-2 text-gray-600`}
            />
            <Text style={tw``}>
              Finishes {format(endDate, "EEEE do MMM yyyy")}
            </Text>
          </View>
          <View
            style={tw`flex-row items-center mt-2 text-gray-500 text-sm mb-2`}
          >
            <FontAwesomeIcon
              icon={faCoins}
              size={20}
              style={tw`mr-2 text-gray-600`}
            />
            <Text style={tw``}>
              £{contributionAmount / 100} {paymentFrequency.toLowerCase()}
            </Text>
          </View>
          <View style={tw`flex-row items-center mt-2 text-gray-500 text-sm`}>
            <FontAwesomeIcon
              icon={faPiggyBank}
              size={20}
              style={tw`mr-2 text-gray-600`}
            />
            <Text style={tw``}>{bankerFee}% banker fee</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            `}
            onPress={() =>
              navigation.navigate("EditPardna", {
                id,
              })
            }
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex justify-center py-4 px-8 border border-red-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
            `}
            onPress={async () => {
              try {
                await deletePardna({
                  variables: { id },
                });

                navigation.navigate("Root");
              } catch (e) {
                console.error({ e });
              }
            }}
          >
            <Text style={tw`text-sm font-medium text-red-500 text-center`}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {participants.length ? (
          <View style={tw`mt-4 h-auto`}>
            <FlatList
              data={participants}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default PardnaScreen;
