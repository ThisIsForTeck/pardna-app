import gql from "graphql-tag";

// TODO: use fragments

export const LOGIN_MUTATION = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      user {
        id
        firstName
        lastName
        email
      }
      token
    }
  }
`;
