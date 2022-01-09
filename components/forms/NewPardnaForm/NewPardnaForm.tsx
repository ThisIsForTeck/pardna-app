import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { CREATE_PARDNA } from "../../../apollo/queries";
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
  contributionAmount: Yup.number(),
  paymentFrequency: Yup.string(),
});

const CreatePardnaForm = () => {
  const [createPardna, { data, loading, error }] = useMutation(CREATE_PARDNA);

  return (
    <Formik
      initialValues={{
        name: "",
        participants: [],
        startDate: "",
        contributionAmount: 0,
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
              contributionAmount,
              paymentFrequency,
            },
          });

          resetForm();
        } catch (e) {
          console.error({ e });
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <View>
            <Text style={tw.style("text-sm font-medium text-gray-700")}>
              Name
            </Text>
            <View style={tw.style("mt-2")}>
              <TextInput
                style={tw.style(
                  "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                )}
                value={values.name}
                placeholder="Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={tw.style("mt-4")}>
            <Text style={tw.style("text-sm font-medium text-gray-700")}>
              Start Date
            </Text>
            <View style={tw.style("mt-2")}>
              <TextInput
                style={tw.style(
                  "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                )}
                value={values.startDate}
                placeholder="Start date"
                onChangeText={handleChange("startDate")}
                onBlur={handleBlur("startDate")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={tw.style("mt-4")}>
            <Text style={tw.style("text-sm font-medium text-gray-700")}>
              Contribution amount
            </Text>
            <View style={tw.style("mt-2")}>
              <TextInput
                style={tw.style(
                  "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                )}
                value={values.contributionAmount}
                placeholder="Contribution amount"
                onChangeText={handleChange("contributionAmount")}
                onBlur={handleBlur("contributionAmount")}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={tw.style("mt-4")}>
            <Text style={tw.style("text-sm font-medium text-gray-700")}>
              Payment frequency
            </Text>
            <View style={tw.style("mt-2")}>
              <TextInput
                style={tw.style(
                  "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                )}
                value={values.paymentFrequency}
                placeholder="Payment frequency"
                onChangeText={handleChange("paymentFrequency")}
                onBlur={handleBlur("paymentFrequency")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <TouchableOpacity
            style={tw.style(
              "mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            )}
            onPress={() => handleSubmit()}
          >
            <Text
              style={tw.style("text-sm font-medium text-white text-center")}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default CreatePardnaForm;
