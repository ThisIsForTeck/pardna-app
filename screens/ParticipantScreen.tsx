import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useContext } from "react";
import tw from "../lib/tailwind";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DELETE_PARTICIPANT_MUTATION,
  PARDNA_QUERY,
  PARTICIPANT_QUERY,
} from "../apollo/queries";
import Loader from "../components/Loader/Loader";
import { AuthContext } from "../contexts/auth";
import { PardnaStackScreenProps } from "../types";
import { format, formatDistanceToNow, isFuture } from "date-fns";
import {
  faCalendar,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { useNavigation } from "@react-navigation/native";

type ItemProps = {
  data: {
    id: string;
    dueDate: Date;
    overdue: boolean;
    settled: boolean;
  };
};

const Item = ({ data: { id, dueDate, overdue, settled } }: ItemProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={tw`bg-white p-6 mb-4 flex-row justify-between`}
      onPress={() =>
        navigation.navigate("Payment", {
          id,
        })
      }
      key={id}
    >
      <View style={tw`flex-row items-center`}>
        <FontAwesomeIcon
          icon={faCalendar}
          size={20}
          style={tw`mr-2 text-gray-500`}
        />
        <Text>{format(dueDate, "EEEE do MMM yyyy")}</Text>
      </View>
      {isFuture(dueDate) ? (
        <Text style={tw`text-gray-500`}>
          Due in {formatDistanceToNow(dueDate)}
        </Text>
      ) : null}
      {overdue ? (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          size={20}
          style={tw`mr-2 text-red-500`}
        />
      ) : null}
      {settled ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          size={20}
          style={tw`mr-2 text-green-500`}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const ParticipantScreen = ({
  navigation,
  route,
}: PardnaStackScreenProps<"Participant">) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    params: { id },
  } = route;

  const {
    loading,
    error,
    data: { participant } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARTICIPANT_QUERY, {
    variables: { id: route.params?.id },
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  const [deleteParticipant] = useMutation(DELETE_PARTICIPANT_MUTATION, {
    refetchQueries: [
      { query: PARDNA_QUERY, variables: { id: participant?.pardna?.id } },
    ],
  });

  if (loading) return <Loader dataType="Participant" />;

  if (error)
    return (
      <View>
        <Text>An error happened trying to fetch the Participant</Text>
      </View>
    );

  if (!participant) return null;

  const { name, email, payments, createdAt, pardna } = participant;

  const renderItem = ({ item }) => <Item data={item} />;

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50 border-black`}>
      <View style={tw`bg-white p-6`}>
        <Text style={tw`text-3xl font-bold text-center mb-4`}>{name}</Text>
        <Text style={tw`text-lg text-gray-500 font-bold text-center`}>
          {email}
        </Text>
        <Text style={tw`text-base text-gray-500 text-center`}>
          Joined {format(createdAt, "EEEE do MMM yyyy")}
        </Text>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`mt-8 flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            `}
            onPress={() =>
              navigation.navigate("EditParticipant", {
                id,
              })
            }
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mt-8 flex justify-center py-4 px-8 border border-red-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
            `}
            onPress={async () => {
              try {
                await deleteParticipant({
                  variables: { id: route.params?.id },
                });

                navigation.navigate("Pardna", {
                  id: pardna.id,
                });
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
      <View style={tw`mt-4 h-auto`}>
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default ParticipantScreen;
