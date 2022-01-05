import { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput, Button } from "react-native-paper";
import { AuthContext } from "../../../contexts/auth";
import { StyledSurface } from "./LogInForm.styled";

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
      {({ handleChange, handleBlur, handleSubmit, isSubmitting, values }) => (
        <StyledSurface
          style={{
            elevation: 4,
          }}
        >
          <TextInput
            label="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            autoCapitalize="none"
            autoComplete={false}
          />
          <TextInput
            label="Password"
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            autoCapitalize="none"
            secureTextEntry
            autoComplete={false}
          />
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => handleSubmit()}
            loading={isSubmitting}
          >
            Log in
          </Button>
        </StyledSurface>
      )}
    </Formik>
  );
};

export default LogInForm;
