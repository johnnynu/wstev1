import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import {
  Button,
  Card,
  Title,
  Paragraph,
  Appbar,
  IconButton,
  TouchableRipple
} from "react-native-paper";
import { app, db } from "../components/firebase";
import {
  collection,
  orderBy,
  getDocs,
  doc,
  deleteDoc
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pantry", id));
      setPantryItems(pantryItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const renderItem = ({ item }) => {
    const expirationDate = new Date(item.expirationDate.seconds * 1000);
    return (
      <TouchableRipple
        onPress={() => navigation.navigate("PantryItem", { item })}
        style={styles.card}
      >
        <Card>
          <Card.Content style={styles.cardContent}>
            <View style={styles.itemInfo}>
              <Title style={styles.itemTitle}>{item.name}</Title>
              <Paragraph style={styles.itemDate}>
                Expires: {expirationDate.toDateString()}
              </Paragraph>
            </View>
            <IconButton
              icon="close"
              size={20}
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            />
          </Card.Content>
        </Card>
      </TouchableRipple>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Your Pantry" />
      </Appbar.Header>
      {pantryItems.length === 0 ? (
        <View style={styles.emptyPantryContainer}>
          <Image
            source={require("./IceCreamDoodle.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.title}>Your Pantry is Empty!</Text>
          <Text style={styles.subtitle}>
            Get started by adding items to your pantry.
          </Text>
        </View>
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
    flex: 1
  },
  emptyPantryContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
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
    width: "100%", // Set the button width to 80% of the screen width
    alignSelf: "center", // Align the button to the center
    marginTop: 20,
    marginBottom: 10
  },
  list: {
    width: "100%",
    marginTop: 10
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    marginBottom: 10,
    marginHorizontal: 20
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemInfo: {
    flexDirection: "column"
  },
  itemDate: {
    fontSize: 14,
    color: "#999"
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 0
  }
});

export default Pantry;
