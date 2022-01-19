import { useContext } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../contexts/auth";
import tw from "../../../lib/tailwind";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});

const SignUpForm = () => {
  const { signUp } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
      validationSchema={SignUpSchema}
      onSubmit={async (
        { firstName, lastName, email, password },
        { resetForm },
      ) => {
        try {
          await signUp({ firstName, lastName, email, password });
          resetForm();
        } catch (e) {
          console.error({ e });
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
        <View>
          <View>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              First name
            </Text>
            <View style={tw`mt-2"`}>
              <TextInput
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.firstName}
                placeholder="Your first name"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={tw`mt-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>Last name</Text>
            <View style={tw`mt-2"`}>
              <TextInput
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.lastName}
                placeholder="Your last name"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={tw`mt-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Email address
            </Text>
            <View style={tw`mt-2"`}>
              <TextInput
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.email}
                placeholder="Your email address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={tw`mt-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>Password</Text>
            <View style={tw`mt-2`}>
              <TextInput
                style={tw`w-full px-6 py-4  border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.password}
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
          </View>
          <TouchableOpacity
            style={tw`flex flex-row items-center mt-8 w-full flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onPress={() => handleSubmit()}
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              {isSubmitting ? "Signing up" : "Sign up"}
            </Text>
            {isSubmitting ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                size={20}
                style={tw`ml-2 text-white`}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default SignUpForm;
