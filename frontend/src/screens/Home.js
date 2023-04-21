import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Button } from "react-native-paper";

const Pantry = ({ navigation }) => {
  const [pantryItems, setPantryItems] = useState([]); // Add this line to manage the pantry items list

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {pantryItems.length === 0 ? (
        <>
          <Image
            source={require("./IceCreamDoodle.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.title}>Your Pantry is Empty!</Text>
          <Text style={styles.subtitle}>
            Get started by adding items to your pantry.
          </Text>
        </>
      ) : (
        <FlatList
          data={pantryItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
      )}
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
  },
  list: {
    width: "100%"
  },
  listItem: {
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  listItemText: {
    fontSize: 18
  }
});

export default Pantry;
