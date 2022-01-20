import { useContext } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../contexts/auth";
import tw from "../../../lib/tailwind";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";
import formatAPIErrors from "../../../utils/formatAPIErrors";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const LogInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});

const LogInForm = () => {
  const { logIn } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LogInSchema}
      onSubmit={async ({ email, password }, { resetForm, setErrors }) => {
        try {
          await logIn({ email, password });

          resetForm();
        } catch (e) {
          console.error({ e });
          const formattedErrors = formatAPIErrors(e);
          setErrors(formattedErrors);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isSubmitting,
        errors,
        touched,
      }) => (
        <View>
          <View>
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
                style={tw`w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={values.password}
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
          </View>
          <View style={tw`mt-6`}>
            {touched.email && errors.email ? (
              <ErrorMessage text={errors.email} />
            ) : null}
            {touched.password && errors.password ? (
              <ErrorMessage text={errors.password} />
            ) : null}
          </View>
          <TouchableOpacity
            style={tw`flex flex-row items-center mt-8 w-full flex justify-center py-4 px-8 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onPress={() => handleSubmit()}
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              {isSubmitting ? "Logging in" : "Log in"}
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

export default LogInForm;
