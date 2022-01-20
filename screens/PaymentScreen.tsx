import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import tw from "../lib/tailwind";
import {
  PARDNA_QUERY,
  PAYMENT_QUERY,
  UPDATE_PAYMENT_MUTATION,
} from "../apollo/queries";
import Loader from "../components/Loader/Loader";
import { AuthContext } from "../contexts/auth";
import { PardnaStackScreenProps } from "../types";
import { format, formatDistanceToNow, isFuture, isToday } from "date-fns";
import {
  faCalendar,
  faCheckCircle,
  faExclamationCircle,
  faSpinnerThird,
} from "@fortawesome/pro-regular-svg-icons";

const PaymentScreen = ({
  navigation,
  route,
}: PardnaStackScreenProps<"Payment">) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    params: { id },
  } = route;

  const {
    loading: paymentQueryLoading,
    error: paymentQueryError,
    data: { payment } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PAYMENT_QUERY, {
    variables: { id: route.params?.id },
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  const [updatePayment] = useMutation(UPDATE_PAYMENT_MUTATION, {
    refetchQueries: [
      { query: PARDNA_QUERY, variables: { id: payment?.participant?.id } },
    ],
  });

  if (paymentQueryLoading) return <Loader dataType="Payment" />;

  if (paymentQueryError)
    return (
      <View>
        <Text>An error happened trying to fetch the Payment</Text>
      </View>
    );

  if (!payment) return null;

  const { dueDate, settled, overdue } = payment;

  return (
    <SafeAreaView style={tw`h-full p-4 bg-gray-50 border-black`}>
      <View style={tw`bg-white p-6 mb-4`}>
        <View>
          {isFuture(dueDate) && !settled && !overdue ? (
            <View style={tw`flex-row items-center mb-6 justify-center`}>
              <Text
                style={tw`text-green-500 text-3xl font-bold text-center mr-2`}
              >
                Due in {formatDistanceToNow(dueDate)}
              </Text>
            </View>
          ) : null}
          {isToday(dueDate) && !settled && !overdue ? (
            <View style={tw`flex-row items-center mb-6 justify-center`}>
              <Text
                style={tw`text-green-500 text-3xl font-bold text-center mr-2`}
              >
                Due today
              </Text>
            </View>
          ) : null}
          {overdue ? (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-2 justify-center`}>
                <Text
                  style={tw`text-red-500 text-3xl font-bold text-center mr-2`}
                >
                  Overdue
                </Text>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size={20}
                  style={tw`mr-2 text-red-500`}
                />
              </View>
              <View>
                <Text style={tw`text-red-400 text-center`}>
                  Due in {formatDistanceToNow(dueDate)}
                </Text>
              </View>
            </View>
          ) : null}
          {settled ? (
            <View style={tw`flex-row items-center mb-6 justify-center`}>
              <Text
                style={tw`text-green-500 text-3xl font-bold text-center mr-2`}
              >
                Settled
              </Text>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={24}
                style={tw`mr-2 text-green-500`}
              />
            </View>
          ) : null}
        </View>
        <View style={tw`flex-row items-center justify-center mb-4`}>
          <FontAwesomeIcon
            icon={faCalendar}
            size={20}
            style={tw`mr-2 text-gray-500`}
          />
          <Text style={tw`text-center`}>
            {format(dueDate, "EEEE do MMM yyyy")}
          </Text>
        </View>
      </View>
      <View style={tw`bg-white p-6`}>
        <Formik
          initialValues={{ settled }}
          onSubmit={async ({ settled }, { resetForm }) => {
            try {
              const {
                data: {
                  updatePayment: {
                    participant: { id: participantId },
                  },
                },
              } = await updatePayment({
                variables: {
                  id,
                  settled,
                },
              });

              resetForm();

              navigation.navigate("Participant", {
                id: participantId,
              });
            } catch (e) {
              console.error({ e });
            }
          }}
        >
          {({ handleSubmit, values, setFieldValue, dirty, isSubmitting }) => (
            <View>
              <BouncyCheckbox
                text="Paid?"
                fillColor={tw.color("indigo-600")}
                textStyle={tw`text-black`}
                onPress={(isChecked: boolean) =>
                  setFieldValue("settled", isChecked)
                }
                isChecked={values.settled}
              />
              {dirty ? (
                <TouchableOpacity
                  style={tw`flex flex-row items-center mt-8 w-full flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            `}
                  onPress={() => handleSubmit()}
                >
                  <Text style={tw`text-sm font-medium text-white text-center`}>
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
    </SafeAreaView>
  );
};

export default PaymentScreen;
