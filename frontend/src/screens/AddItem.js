import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { auth } from "../components/firebase";
const AddItem = ({ navigation }) => {
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      const docRef = await addDoc(collection(db, "pantry",user.uid, "items"), {
        name: itemName,
        expirationDate: expirationDate
      });
      console.log("Document written with ID: ", docRef.id);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpirationDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Item" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.label}>Item Name:</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
        />
        <Text style={styles.label}>Expiration Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={expirationDate.toLocaleDateString()}
            editable={false}
            onTouchStart={() => setShowDatePicker(true)}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Add Item
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
    // Add this new style
    paddingHorizontal: 20,
    paddingTop: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    marginBottom: 20
  },
  button: {
    marginTop: 10
  }
});

export default AddItem;
