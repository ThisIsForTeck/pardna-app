import { useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { Formik } from "formik";
import tw from "../lib/tailwind";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PARTICIPANT_QUERY,
  UPDATE_PARTICIPANT_MUTATION,
} from "../apollo/queries";
import Loader from "../components/Loader/Loader";
import { AuthContext } from "../contexts/auth";
import { PardnaStackScreenProps } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";

const EditParticipantScreen = ({
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

  const [updateParticipant] = useMutation(UPDATE_PARTICIPANT_MUTATION, {
    refetchQueries: [
      { query: PARTICIPANT_QUERY, variables: { id: route.params?.id } },
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

  const { name, email } = participant;

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50 border-black`}>
      <View style={tw`bg-white p-6`}>
        <View style={tw`bg-white p-6`}>
          <Formik
            initialValues={{ name, email }}
            onSubmit={async ({ name, email }, { resetForm }) => {
              try {
                await updateParticipant({
                  variables: {
                    id,
                    name,
                    email,
                  },
                });

                resetForm();

                navigation.navigate("Participant", {
                  id,
                });
              } catch (e) {
                console.error({ e });
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              dirty,
              isSubmitting,
            }) => (
              <View>
                <Text style={tw`text-3xl font-bold mb-8 text-center`}>
                  Edit Participant
                </Text>
                <View>
                  <Text style={tw`text-sm font-medium text-gray-700`}>
                    Name
                  </Text>
                  <View style={tw`mt-2`}>
                    <TextInput
                      style={tw`
                  w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={values.name}
                      placeholder="Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={tw`mt-4`}>
                  <Text style={tw`text-sm font-medium text-gray-700`}>
                    Email
                  </Text>
                  <View style={tw`mt-2`}>
                    <TextInput
                      style={tw`
                  w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={values.email}
                      placeholder="Email"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                {dirty ? (
                  <TouchableOpacity
                    style={tw`flex flex-row items-center mt-8 w-full flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            `}
                    onPress={() => handleSubmit()}
                  >
                    <Text
                      style={tw`text-sm font-medium text-white text-center`}
                    >
                      {isSubmitting ? "Saving changes" : "Save changes"}
                    </Text>
                    {isSubmitting ? (
                      <FontAwesomeIcon
                        icon={faSpinnerThird}
                        size={20}
                        style={tw`ml-2 text-white`}
                      />
                    ) : null}
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditParticipantScreen;
