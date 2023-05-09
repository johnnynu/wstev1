import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Modal } from "react-native";
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
import NutrientModal from "../components/NutrientModal";
import { auth } from "../components/firebase";
const USDA_API_KEY = "EA6bttzjzgJuyrtd9V2kKciMSPqhsk1PxG9iTZqM";

const Pantry = ({ navigation }) => {
  const [expiringItems, setExpiringItems] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [showNutrientModal, setShowNutrientModal] = useState(false);
  const [nutrientData, setNutrientData] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);

  // the useEffect here pulls the data from the database and stores it in the pantryItems array
  // Fetch pantry items from Firestore and update state
  useEffect(() => {
    const user = auth.currentUser;
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "pantry", user.uid, "items"),
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

  // this function deletes the item from the database
  // and removes it from the pantryItems array
  // Delete an item from the pantry and update state
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pantries", user.uid, "items", id));
      setPantryItems(pantryItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  // Fetch nutrient information from USDA API and display in a modal
  const handleDisplayNutrient = async (item) => {
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${item.name}`
      );
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        /// console.log(`Nutrient data for ${item.name}: `, data.foods[0].foodNutrients);
        const nutrientData = data.foods[0].foodNutrients.slice(0, 8);
        setNutrientData(nutrientData);
        setShowNutrientModal(true);
      } else {
        console.log(`No nutrient data found for ${item.name}`);
      }
    } catch (error) {
      console.error("Error fetching nutrient data: ", error);
    }
  };

  const renderItem = ({ item }) => {
    const expirationDate = new Date(item.expirationDate?.seconds * 1000);

    return (
      <TouchableRipple
        onPress={() => {
          navigation.navigate("PantryItem", { item });
        }}
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
              icon="information-outline"
              onPress={() => handleDisplayNutrient(item)}
            />
            <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
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
        <>
          <FlatList
            data={pantryItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
          {expiringItems.map((item) => {
            const expirationDate = new Date(item.expirationDate.seconds * 1000);
            const timeDiff = expirationDate.getTime() - new Date().getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            console.log(item.name);
            if (daysDiff <= 21) {
              return (
                <Modal key={item.id} visible={showModal} transparent={true}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>
                        Is {item.name} still in stock?
                      </Text>
                      <Button
                        onPress={() => {
                          handleModalClose("Yes", item);
                        }}
                        style={styles.modalButton}
                      >
                        Yes
                      </Button>
                      <Button
                        onPress={() => {
                          handleModalClose("No", item);
                        }}
                        style={styles.modalButton}
                      >
                        No
                      </Button>
                    </View>
                  </View>
                </Modal>
              );
            }
          })}
        </>
      )}
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
    width: "100%",
    alignSelf: "center",
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
  },
  nutrientModal: {
    margin: 0,
    justifyContent: "flex-end"
  },
  nutrientModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%"
  },
  nutrientModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  nutrientList: {
    alignItems: "center"
  },
  nutrientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10
  },
  nutrientName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  nutrientAmount: {
    color: "#5D3FD3"
  },
  nutrientUnit: {
    marginLeft: 4,
    fontSize: 12
  }
});
export default Pantry;
