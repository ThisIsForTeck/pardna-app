import { useContext } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../contexts/auth";
import tw from "../../../lib/tailwind";

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
      onSubmit={async ({ email, password }, { resetForm }) => {
        try {
          await logIn({ email, password });

          resetForm();
        } catch (e) {
          console.error({ e });
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <View>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Email address
            </Text>
            <View style={tw`mt-2`}>
              <TextInput
                style={tw`
                  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
                style={tw`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
            style={tw`
              mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onPress={() => handleSubmit()}
          >
            <Text style={tw`text-sm font-medium text-white text-center`}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default LogInForm;
