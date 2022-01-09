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
export const CREATE_PARDNA = gql`
  mutation (
    $name: String
    $participants: [ParticipantInput]
    $startDate: Date
    $contributionAmount: Int
    $ledger: LedgerInput
    $paymentFrequency: Frequency
  ) {
    createPardna(
      name: $name
      participants: $participants
      startDate: $startDate
      contributionAmount: $contributionAmount
      ledger: $ledger
      paymentFrequency: $paymentFrequency
    ) {
      id
    }
  }
`;

export const PARDNAS_QUERY = gql`
  query PARDNAS_QUERY {
    pardnas {
      id
      name
      startDate
      endDate
      participants {
        id
        name
        payments {
          id
          type
          dueDate
          overdue
          settled
        }
      }
    }
  }
`;
