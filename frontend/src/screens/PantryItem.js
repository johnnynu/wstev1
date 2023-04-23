import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import {
  Text,
  Button,
  Appbar,
  Card,
  Title,
  Paragraph
} from "react-native-paper";
import { fetchUnsplashImage } from "../components/unsplash";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../components/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PantryItem = ({ route, navigation }) => {
  const { item } = route.params;
  const { name, expirationDate, id } = item;
  const [editable, setEditable] = useState(false);
  const [newDate, setNewDate] = useState(expirationDate.toDate());
  const [imageUrl, setImageUrl] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await fetchUnsplashImage(name);
      setImageUrl(url);
    };

    fetchImage();
  }, [name]);

  const updateExpirationDate = async (date) => {
    try {
      const pantryRef = doc(db, "pantry", id);
      await updateDoc(pantryRef, {
        expirationDate: date
      });
      setEditable(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Your Pantry" />
      </Appbar.Header>
      <Card style={styles.card}>
        {imageUrl && (
          <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
        )}
        <Card.Content style={styles.textContainer}>
          <Title style={styles.itemName}>{name}</Title>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.editableDateContainer}
          >
            <Paragraph style={styles.expirationDate}>
              Expiration Date: {formatDate(newDate).toString()}
            </Paragraph>
            <Icon name="pencil" size={18} color="#5D3FD3" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={newDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setNewDate(selectedDate);
                  updateExpirationDate(selectedDate);
                }
              }}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  card: {
    margin: 15,
    borderRadius: 10
  },
  image: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  textContainer: {
    marginTop: 15
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5
  },
  expirationDate: {
    fontSize: 18
  },
  editableDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#5D3FD3",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  expirationDate: {
    fontSize: 18,
    marginRight: 4
  }
});

export default PantryItem;
