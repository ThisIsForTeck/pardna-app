import { useContext } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../contexts/auth";

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
      onSubmit={async (
        { email, password },
        { setSubmitting, setStatus, resetForm },
      ) => {
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
          <TextInput
            value={values.email}
            placeholder="Your email address"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            autoCapitalize="none"
          />
          <TextInput
            value={values.password}
            placeholder="PIN code"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default LogInForm;
