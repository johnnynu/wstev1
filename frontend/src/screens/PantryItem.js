import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Modal} from "react-native";
import {
  Text,
  Button,
  Appbar,
  Card,
  Title,
  Paragraph
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { fetchUnsplashImage } from "../components/unsplash";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../components/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import "intl"
import 'intl/locale-data/jsonp/en-US';

const USDA_API_KEY = "EA6bttzjzgJuyrtd9V2kKciMSPqhsk1PxG9iTZqM";


// call the Polyfill function to provide the Intl object
if (!global.Intl) {
  global.Intl = require('intl');
}

const PantryItem = ({ route, navigation }) => {
  const { item } = route.params;
  const { name, expirationDate, id } = item;
  const [editable, setEditable] = useState(false);
  const [newDate, setNewDate] = useState(expirationDate.toDate());
  const [imageUrl, setImageUrl] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nutrientData, setNutrientData] = useState(null);
  const [showNutrientModal, setShowNutrientModal] = useState(false);
  useEffect(() => {
    
    const fetchImage = async () => {
      const url = await fetchUnsplashImage(name);
      setImageUrl(url);
    };

    fetchImage();
  }, [name]);
  const updateExpirationDate = async (date) => {
    try {
      const pantryRef = doc(db, "pantries", user.uid, "items", id);
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
  const handleDisplayNutrient = async (itemName) => {
    console.log("showNutrientModal set to true");
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${item.name}`
      );
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        const fdcId = data.foods[0].fdcId;
        const nutrientResponse = await fetch(
          `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`
        );
        const nutrientData = await nutrientResponse.json();
        setNutrientData(nutrientData.foodNutrients.slice(0, 8));
        setShowNutrientModal(true);
        console.log("showNutrientModal set to true");
      } else {
        console.error("No nutrient data found.");
      }
    } catch (error) {
      console.error("Error fetching nutrient data: ", error);
    }
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
          <TouchableOpacity onPress={() => handleDisplayNutrient(name)}>
            <View style={styles.nutrientButton}>
              <Text style={styles.nutrientButtonText}>Nutrients</Text>
            </View>
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
  
          <View style={styles.editableDateContainer}>
            <Text style={styles.expirationDate}>Expires:</Text>
            {editable ? (
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
            ) : (
              <TouchableOpacity onPress={() => setEditable(true)}>
                <View style={{ flexDirection: "row" }}>
                  <Text>{formatDate(newDate)}</Text>
                  <Icon name="pencil" size={20} color="#5D3FD3" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
  
      <Modal
        visible={showNutrientModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View>
            <TouchableOpacity onPress={() => setShowNutrientModal(false)}>
              <Icon name="close" size={30} color="#5D3FD3" />
            </TouchableOpacity>
            <Text style={styles.nutrientTitle}>Nutrition Facts</Text>
            <ScrollView style={styles.nutrientData}>
              {nutrientData ? (
                nutrientData.foodNutrients.slice(0, 8).map((nutrient) => (
                  <View key={nutrient.nutrientId} style={styles.nutrientItem}>
                    <Text style={styles.nutrientName}>
                      {nutrient.nutrientName}
                    </Text>
                    <Text style={styles.nutrientAmount}>
                      {nutrient.value.toFixed(2)}
                      <Text style={styles.nutrientUnit}> {nutrient.unitName}</Text>
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No nutrient data available</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );}
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
      fontSize: 18,
      marginRight: 4
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
    nutrientButton: {
      backgroundColor: "#5D3FD3",
      borderRadius: 5,
      padding: 8,
      alignItems: "center",
      marginTop: 10
    },
    nutrientButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20
    },
    nutrientData: {
      alignItems: "center"
    },
    nutrientTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20
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
 export default PantryItem; 