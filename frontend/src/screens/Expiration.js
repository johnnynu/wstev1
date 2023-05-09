import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../components/firebase";
import Modal from "react-native-modal";
import axios from "axios";
import { auth } from "../components/firebase";
const Expiration = () => {
  const [itemsExpiringInAWeek, setItemsExpiringInAWeek] = useState([]);
  const [itemsExpiringInADay, setItemsExpiringInADay] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemImage, setItemImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemExpirationDate, setItemExpirationDate] = useState("");

  const closeModal = () => {
    setIsModalVisible(false);
    setItemImage(null);
    };
    useEffect(() => {
      const user = auth.currentUser;
      const q = query(
        collection(db, "pantry",user.uid,"items"),
        where(
          "expirationDate",
          "<=",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        )
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const itemsExpiringInWeek = [];
        const itemsExpiringInDay = []; // add a new state for items expiring in a day
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const expirationDate = new Date(data.expirationDate.seconds * 1000);
          const currentDate = new Date();
          const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    
          if (expirationDate < currentDate) {
            // If the item has already expired, delete it
            deleteDoc(doc.ref);
            setIsModalVisible(true);
            setItemName(data.name);
            setItemExpirationDate(expirationDate.toLocaleDateString());
            fetchItemImage(data.name);
          } else if (expirationDate < new Date(Date.now() + oneDay)) {
            // If the item is expiring within a day, add it to itemsExpiringInADay
            itemsExpiringInDay.push({ id: doc.id, ...data });
            
          } else {
            // Otherwise, add it to itemsExpiringInAWeek and fetch the image
            itemsExpiringInWeek.push({ id: doc.id, ...data });
            
          }
        });
        setItemsExpiringInAWeek(itemsExpiringInWeek);
        setItemsExpiringInADay(itemsExpiringInDay); // set the items expiring in a day state
      });
      return () => unsubscribe();
    }, []);
    
    
    


const handleDeleteItem = (id, name) => {
const itemRef = doc(db, "pantries", user.uid, "items", id);
deleteDoc(itemRef);
setItemName(name);
};

const fetchItemImage = async (query) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${query}&category=food&client_id=y47Pfmw9T76hzvaA5y9Wf7Xsu8ueyIRYn8Vpb47kYRU`
    );
    if (response.data.urls && response.data.urls.raw) {
      setItemImage(response.data.urls.raw);
    }
  } catch (error) {
    console.error(error);
  }
};


return (
<View style={styles.container}>
<View style={styles.section}>
<Text style={styles.title}>Expiring in a week:</Text>
{itemsExpiringInAWeek.length > 0 ? (
itemsExpiringInAWeek.map((item) => (
<View style={styles.itemContainer} key={item.id}>
<Text style={styles.itemName}>{item.name}</Text>
<Text style={styles.expirationDate}>
{new Date(item.expirationDate.seconds * 1000).toLocaleDateString()}
</Text>
<TouchableOpacity onPress={() => handleDeleteItem(item.id, item.name)}>
<Text style={styles.deleteButton}>Delete</Text>
</TouchableOpacity>
</View>
))
) : (
<Text style={styles.noItems}>No items expiring in a week.</Text>
)}
</View>
<View style={styles.section}>
<Text style={styles.title}>Expiring in a day:</Text>
{itemsExpiringInADay.length > 0 ? (
itemsExpiringInADay.map((item) => (
<View style={styles.itemContainer} key={item.id}>
<Text style={styles.itemName}>{item.name}</Text>
<Text style={styles.expirationDate}>
{new Date(item.expirationDate.seconds * 1000).toLocaleDateString()}
</Text>
<TouchableOpacity onPress={() => handleDeleteItem(item.id, item.name)}>
<Text style={styles.deleteButton}>Delete</Text>
</TouchableOpacity>
</View>
))
) : (
<Text style={styles.noItems}>No items expiring in a day.</Text>
)}
</View>
<Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Item Has Been Deleted</Text>
    <Image
      source={{ uri: itemImage }}
      style={styles.modalImage}
      resizeMode="cover"
    />
    <Text style={styles.modalText}>
      {itemName} item expired on {itemExpirationDate}.
    </Text>
    <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
      <Text style={styles.modalButtonText}>OK</Text>
    </TouchableOpacity>
  </View>
</Modal>

</View>
);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
    section: {
      flex: 1,
      marginBottom: 20,
      backgroundColor: "#FFE8D6",
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    itemName: {
      fontSize: 18,
      flex: 1,
    },
    expirationDate: {
      fontSize: 16,
      color: "#888",
      flex: 1,
      marginLeft: 10,
    },
    deleteButton: {
      color: "red",
      fontWeight: "bold",
      fontSize: 16,
    },
    noItems: {
      fontSize: 18,
      textAlign: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        borderColor: "#000",
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
      },
      modalText: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
      },
      modalImage: {
        width: "100%",
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
      },
      modalButton: {
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      modalButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
  });
  
  
  
  
  

export default Expiration;





