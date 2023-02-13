import { useState } from "react";
import { View, Image } from "react-native";
import { Text, Appbar, Banner } from "react-native-paper";
import SearchFunc from "../components/SearchFunc";

const Home = () => {
  const [visible, setVisible] = useState(true);
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Your Pantry" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <Banner
        visible={visible}
        actions={[
          {
            label: "Add items",
            onPress: () => setVisible(false)
          }
        ]}
        icon="food-variant"
      >
        You currently have no items in your pantry.
      </Banner>
      <SearchFunc />
    </View>
  );
};

export default Home;
