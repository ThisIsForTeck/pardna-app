import { useQuery } from "@apollo/client";
import { useContext } from "react";
import tw from "../lib/tailwind";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PARDNA_QUERY } from "../apollo/queries";
import Loader from "../components/Loader/Loader";
import { AuthContext } from "../contexts/auth";
import { PardnaStackScreenProps } from "../types";
import EditPardnaForm from "../components/forms/EditPardnaForm/EditPardnaForm";

const EditPardnaScreen = ({
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
    data: { pardna } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARDNA_QUERY, {
    variables: { id },
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  if (loading) return <Loader dataType="Pardna" />;

  if (error)
    return (
      <View>
        <Text>An error happened trying to fetch the Pardna</Text>
      </View>
    );

  if (!pardna) return null;

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50 border-black`}>
      <View style={tw`bg-white p-6`}>
        <EditPardnaForm pardna={pardna} />
      </View>
    </SafeAreaView>
  );
};

export default EditPardnaScreen;
