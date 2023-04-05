import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./IceCreamDoodle.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>Your Pantry is Empty!</Text>
      <Text style={styles.subtitle}>
        Get started by adding items to your pantry.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddItem")} // Replace 'AddItem' with the appropriate screen name for adding items to the pantry
        style={styles.addButton}
      >
        Add Items
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
  },
  addButton: {
    marginTop: 20
  }
});

export default Home;
