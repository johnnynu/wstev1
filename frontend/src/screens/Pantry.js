import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import { app, db } from "../components/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs
} from "firebase/firestore";

const Pantry = ({ navigation }) => {
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "pantry"),
          orderBy("expirationDate")
        );
        console.log(querySnapshot);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setPantryItems(items);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const expirationDate = new Date(item.expirationDate.seconds * 1000);
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>
            Expiration Date: {expirationDate.toDateString()}
          </Paragraph>
        </Card.Content>
      </Card>
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
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddItem")}
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
    width: "100%",
    marginTop: 60
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    marginBottom: 10
  }
});

export default Pantry;
