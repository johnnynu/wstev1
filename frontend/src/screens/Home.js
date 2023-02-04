import { useState } from "react";
import { View, Image } from "react-native";
import { Text, Appbar, Banner } from "react-native-paper";

const PantryRoute = () => <Text>Pantry</Text>;

const Home = () => {
  const [visible, setVisible] = useState(true);
  return (
    <View>
      <Appbar>
        <Appbar.Content title="Your Pantry" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar>
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
    </View>
  );
};

export default Home;
