import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal
} from "react-native";
import {
  Text,
  Button,
  Appbar,
  Card,
  Title,
  Paragraph,
  ActivityIndicator
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { fetchUnsplashImage } from "../components/unsplash";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../components/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const PantryItem = ({ route, navigation }) => {
  // we have alot of states to manage on this screen
  // the states here render the image from unsplash,
  // the date picker, and the ingredient itself
  const { item } = route.params;
  const { name, expirationDate, id } = item;
  console.log("PantryItem component rendered with name:", name);
  const [editable, setEditable] = useState(false);
  const [newDate, setNewDate] = useState(expirationDate.toDate());
  const [imageUrl, setImageUrl] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userPantryItems, setUserPantryItems] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);

  // this use effect calls the fetchUnsplashImage function
  // immediately once were shown the page, to get a stock photo
  const [nutrientData, setNutrientData] = useState(null);
  const [showNutrientModal, setShowNutrientModal] = useState(false);
  useEffect(() => {
    const fetchImage = async () => {
      console.log("Fetching image...");
      const url = await fetchUnsplashImage(name);
      setImageUrl(url);
      console.log("Image URL:", url);
    };

    fetchImage();
  }, [name]);

  // For fetching user pantry items and recommended recipes
  useEffect(() => {
    console.log("Fetching user pantry items...");
    fetchUserPantryItems();
    console.log(userPantryItems);
  }, []);

  useEffect(() => {
    if (userPantryItems.length > 1) {
      console.log("Fetching recommended recipes...");
      fetchRecommendedRecipes();
    } else {
      console.log("Not enough pantry items to fetch recommended recipes");
    }
  }, [userPantryItems]);

  // this function updates the expiration date in the database
  // by clicking on the date itself
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

  // this function grabs all of the users current pantry items
  // and stores them in an array. we are only taking the name.
  const fetchUserPantryItems = async () => {
    try {
      const pantryItems = []; // Array to store pantry items
      // Fetch pantry items from Firebase and add them to the array
      const querySnapshot = await getDocs(collection(db, "pantry"));
      querySnapshot.forEach((doc) => {
        pantryItems.push(doc.data().name);
      });
      setUserPantryItems(pantryItems);
      console.log("User pantry items:", pantryItems);
    } catch (error) {
      console.error("Error fetching user pantry items:", error);
    }
  };

  // this function generates a random recipe based on the users
  // current pantry items. it will generate a random number of
  // ingredients based on the number you set in the function.
  const getRandomIngredients = (pantryItems, numIngredients) => {
    const randomIndices = new Set();
    while (randomIndices.size < numIngredients) {
      const index = Math.floor(Math.random() * pantryItems.length);
      randomIndices.add(index);
    }
    console.log(randomIndices);
    return Array.from(randomIndices).map((index) => pantryItems[index]);
  };

  // this function fetches the recommended recipes from the spoonacular
  // based on the random ingredients presented.
  const fetchRecommendedRecipes = async () => {
    try {
      const numIngredients = 2; // You can adjust this number as needed
      const ingredients = getRandomIngredients(userPantryItems, numIngredients);
      console.log("Random ingredients:", ingredients);
      const ingredientsQueryParam = ingredients.join(",");
      console.log("Ingredients Query Param:", ingredientsQueryParam);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=96dd1ac03932492e8c229808d9539ab4&ingredients=${ingredientsQueryParam}&number=5`
      );
      const data = await response.json();
      console.log("Recommended Recipes:", data);
      setRecommendedRecipes(data);
    } catch (error) {
      console.error("Error fetching recommended recipes:", error);
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
      <View style={styles.recommendedRecipesContainer}>
        <Text style={styles.recommendedRecipesTitle}>
          Based on your pantry:
        </Text>
        {recommendedRecipes.length === 0 ? (
          <Text style={styles.noResultsMessage}>
            No recipes found for this item. Please try again with a different
            item or add more items to your pantry for better recommendations.
          </Text>
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {recommendedRecipes.map((recipe, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("RecipeDetails", { recipe })}
              >
                <Card key={recipe.id} style={styles.recommendedRecipeCard}>
                  <Card.Cover
                    source={{ uri: recipe.image }}
                    style={styles.recommendedRecipeImage}
                  />
                  <Card.Content>
                    <Title
                      numberOfLines={1}
                      style={styles.recommendedRecipeTitle}
                    >
                      {recipe.title}
                    </Title>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
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
  },
  recommendedRecipesContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10
  },
  recommendedRecipesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  recommendedRecipeCard: {
    marginRight: 10,
    width: 150,
    borderRadius: 10
  },
  recommendedRecipeImage: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  recommendedRecipeTitle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center"
  }
});

export default PantryItem;
