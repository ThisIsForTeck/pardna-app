import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { View, Text } from "react-native";
import { PARDNAS_QUERY } from "../apollo/queries";
import { AuthContext } from "../contexts/auth";
import { RootTabScreenProps } from "../types";

const YourPardnasScreen = ({
  navigation,
}: RootTabScreenProps<"YourPardnas">) => {
  const {
    state: { userToken },
  } = useContext(AuthContext);

  const {
    data: { pardnas } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(PARDNAS_QUERY, {
    skip: !userToken, // wait for currentUser query before executing this one - https://github.com/apollographql/react-apollo/issues/3624#issuecomment-545990545
  });

  if (!pardnas) {
    return null;
  }

  return (
    <View>
      {pardnas.map(({ id, name }: { id: string; name: string }) => (
        <View key={id}>
          <Text>{id}</Text>
          <Text>{name}</Text>
        </View>
      ))}
    </View>
  );
};

export default YourPardnasScreen;
