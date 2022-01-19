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
import tw from "../../../lib/tailwind";
import { PARDNA_QUERY, UPDATE_PARDNA_MUTATION } from "../../../apollo/queries";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import CurrencyInput from "react-native-currency-input";
import { isSameDay } from "date-fns";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const EditPardnaSchema = Yup.object().shape({
  name: Yup.string(),
  participants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    }),
  ),
  startDate: Yup.date(),
  duration: Yup.number(),
  contributionAmount: Yup.number(), // TODO: should be number but couldnt get it to work with TextInput types
  bankerFee: Yup.number(),
  paymentFrequency: Yup.string(),
});

const EditPardnaForm = ({ pardna }) => {
  const navigation = useNavigation();
  const [updatePardna] = useMutation(UPDATE_PARDNA_MUTATION, {
    refetchQueries: [{ query: PARDNA_QUERY, variables: { id: pardna.id } }],
  });
  const [paymentFrequencyOpen, setPaymentFrequencyOpen] = useState(false);
  const [paymentFrequencies, setPaymentFrequencies] = useState([
    { label: "Daily", value: "DAILY" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ]);

  const {
    id,
    name,
    contributionAmount,
    bankerFee,
    participants,
    startDate,
    duration,
    ledger: { paymentFrequency } = {},
  } = pardna;

  const initialValues = {
    name,
    startDate: new Date(startDate),
    duration,
    bankerFee,
    contributionAmount: contributionAmount / 100,
    paymentFrequency,
    participants,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditPardnaSchema}
      onSubmit={async (values, { resetForm }) => {
        // TODO: only send changed values to api

        const updates = {};

        for (const prop in initialValues) {
          if (values[prop] && initialValues[prop] !== values[prop]) {
            if (
              prop === "startDate" &&
              isSameDay(initialValues[prop], values[prop])
            ) {
              // FIX: fixes issue of selecting same date using date picker is seen as an update as time is different
              continue;
            } else {
              updates[prop] = values[prop];
            }
          }
        }

        try {
          await updatePardna({
            variables: {
              id,
              ...updates,
            },
          });

          resetForm();

          navigation.navigate("Pardna", {
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
        setFieldValue,
        isSubmitting,
      }) => {
        const getDurationSuffix = () => {
          let prefix;

          switch (values.paymentFrequency) {
            case "DAILY":
              prefix = " 2days";
              break;
            case "WEEKLY":
              prefix = " weeks";
              break;
            case "MONTHLY":
              prefix = " months";
              break;
            default:
              prefix = "MONTHLY";
              break;
          }

          return prefix;
        };

        const durationSuffix = getDurationSuffix();

        return (
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
            <View
              style={[
                tw`mt-4`,
                Platform.OS !== "android" && { zIndex: 999999 },
              ]}
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
                Duration
              </Text>
              <View style={tw`mt-2`}>
                <CurrencyInput
                  style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  value={values.duration}
                  suffix={durationSuffix}
                  separator="."
                  delimiter=","
                  precision={0}
                  minValue={0}
                  maxValue={52}
                  onChangeValue={(value: number | null) =>
                    setFieldValue("duration", value)
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
            <View style={tw`mt-4`}>
              <Text style={tw`text-sm font-medium text-gray-700`}>
                Banker fee per contribution (£
                {values.contributionAmount * (values.bankerFee / 100)})
              </Text>
              <View style={tw`mt-2`}>
                <CurrencyInput
                  style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  value={values.bankerFee}
                  suffix=" %"
                  separator="."
                  delimiter=","
                  precision={2}
                  minValue={0}
                  maxValue={40}
                  onChangeValue={(value: number | null) =>
                    setFieldValue("bankerFee", value)
                  }
                />
              </View>
            </View>
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
        );
      }}
    </Formik>
  );
};

export default EditPardnaForm;
