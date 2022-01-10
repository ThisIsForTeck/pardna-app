import { useState } from "react";
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import CurrencyInput from "react-native-currency-input";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { CREATE_PARDNA, PARDNAS_QUERY } from "../../../apollo/queries";
import tw from "../../../lib/tailwind";

const CreatePardnaSchema = Yup.object().shape({
  name: Yup.string(),
  participants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    }),
  ),
  startDate: Yup.date(),
  contributionAmount: Yup.number(), // TODO: should be number but couldnt get it to work with TextInput types
  paymentFrequency: Yup.string(),
});

const CreatePardnaForm = () => {
  const [createPardna, { data, loading, error }] = useMutation(CREATE_PARDNA, {
    refetchQueries: [PARDNAS_QUERY],
  });
  const [paymentFrequencyOpen, setPaymentFrequencyOpen] = useState(false);
  const [paymentFrequencies, setPaymentFrequencies] = useState([
    { label: "Daily", value: "DAILY" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ]);
  const navigation = useNavigation();

  return (
    <Formik
      initialValues={{
        name: "",
        participants: [],
        startDate: new Date(),
        contributionAmount: 10,
        paymentFrequency: "",
      }}
      validationSchema={CreatePardnaSchema}
      onSubmit={async (
        { name, participants, startDate, contributionAmount, paymentFrequency },
        { resetForm },
      ) => {
        try {
          await createPardna({
            variables: {
              name,
              participants,
              startDate,
              contributionAmount, // TODO: cast to a number
              paymentFrequency,
              ledger: {},
            },
          });

          resetForm();

          navigation.navigate("Root");
        } catch (e) {
          console.error({ e });
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View>
          <View>
            <Text style={tw`text-sm font-medium text-gray-700`}>Name</Text>
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
              Start Date
            </Text>
            <View style={tw`mt-2`}>
              <DateTimePicker
                testID="dateTimePicker"
                value={values.startDate}
                onChange={(event: Event, date: Date | undefined) =>
                  setFieldValue("startDate", date)
                }
              />
            </View>
          </View>
          <View style={tw`mt-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Contribution amount
            </Text>
            <View style={tw`mt-2`}>
              <CurrencyInput
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.contributionAmount}
                prefix="£"
                separator="."
                delimiter=","
                precision={2}
                minValue={0}
                onChangeValue={(value: number | null) =>
                  setFieldValue("contributionAmount", value)
                }
              />
            </View>
          </View>
          <View
            style={[tw`mt-4`, Platform.OS !== "android" && { zIndex: 999999 }]}
          >
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Payment frequency
            </Text>
            <View style={tw`mt-2`}>
              <DropDownPicker
                placeholder="Select Payment frequency"
                showTickIcon={false}
                open={paymentFrequencyOpen}
                value={values.paymentFrequency}
                items={paymentFrequencies}
                setOpen={setPaymentFrequencyOpen}
                setValue={(state) => {
                  let newState = state;

                  if (typeof state === "function") {
                    newState = state(values.paymentFrequency);
                  }

                  setFieldValue("paymentFrequency", newState);
                }}
                setItems={setPaymentFrequencies}
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm `}
                dropDownContainerStyle={{
                  borderColor: tw.color("gray-300"),
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={tw`mt-8 w-full flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            `}
            onPress={() => handleSubmit()}
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default CreatePardnaForm;
