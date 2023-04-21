import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Appbar } from "react-native-paper";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your App</Text>
        <Text style={styles.subtitle}>
          Manage your pantry and discover new recipes.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Pantry")}
          style={styles.button}
        >
          Go to Pantry
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40
  },
  button: {
    width: "100%",
    alignSelf: "center"
  }
});

export default Home;
