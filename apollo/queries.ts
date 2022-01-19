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

export const CREATE_USER_MUTATION = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
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

export const CREATE_PARDNA_MUTATION = gql`
  mutation createPardna(
    $name: String
    $paymentFrequency: Frequency
    $participants: [ParticipantInput]
    $startDate: Date
    $duration: Int
    $contributionAmount: Int
    $bankerFee: Float
  ) {
    createPardna(
      name: $name
      paymentFrequency: $paymentFrequency
      participants: $participants
      startDate: $startDate
      duration: $duration
      contributionAmount: $contributionAmount
      bankerFee: $bankerFee
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

export const PARDNA_QUERY = gql`
  query pardna($id: String!) {
    pardna(id: $id) {
      id
      name
      startDate
      duration
      endDate
      contributionAmount
      bankerFee
      ledger {
        id
        paymentFrequency
      }
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

export const PARTICIPANT_QUERY = gql`
  query participant($id: String!) {
    participant(id: $id) {
      id
      name
      email
      createdAt
      pardna {
        id
        name
      }
      payments {
        id
        type
        dueDate
        settled
        settledDate
        overdue
      }
    }
  }
`;

export const PAYMENT_QUERY = gql`
  query payment($id: String!) {
    payment(id: $id) {
      id
      type
      dueDate
      settled
      settledDate
      participant {
        id
      }
    }
  }
`;

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation updatePayment($id: String, $settled: Boolean) {
    updatePayment(id: $id, settled: $settled) {
      id
      settled
      participant {
        id
      }
    }
  }
`;

export const UPDATE_PARTICIPANT_MUTATION = gql`
  mutation updateParticipant($id: String, $name: String, $email: String) {
    updateParticipant(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const DELETE_PARTICIPANT_MUTATION = gql`
  mutation deleteParticipant($id: String) {
    deleteParticipant(id: $id) {
      id
    }
  }
`;

export const DELETE_PARDNA_MUTATION = gql`
  mutation deletePardna($id: String) {
    deletePardna(id: $id) {
      id
    }
  }
`;

export const UPDATE_PARDNA_MUTATION = gql`
  mutation updatePardna(
    $id: String!
    $name: String
    $paymentFrequency: Frequency
    $startDate: Date
    $duration: Int
    $contributionAmount: Int
    $bankerFee: Float
    $addParticipants: [ParticipantInput]
    $removeParticipants: [RemoveParticipantInput]
  ) {
    updatePardna(
      id: $id
      name: $name
      paymentFrequency: $paymentFrequency
      startDate: $startDate
      duration: $duration
      contributionAmount: $contributionAmount
      bankerFee: $bankerFee
      addParticipants: $addParticipants
      removeParticipants: $removeParticipants
    ) {
      id
    }
  }
`;
