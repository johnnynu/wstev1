import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Card,
  TouchableRipple,
  IconButton,
  useTheme
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import FavoritesContext from "./FavoritesContext";
import _ from "lodash";

const SearchFunc = ({ props }) => {
  // we pass in searchQuery and searchType as props so that we can call the api to return to us
  // what we want to display
  const { searchQuery, searchType } = props;
  const [searchRes, setSearchRes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    if (!_.isEmpty(searchQuery)) {
      getRecipes();
    } else {
      if (isMounted) {
        setSearchRes([]);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [searchQuery, searchType]);

  const { addFavorite, removeFavorite, isFavorite } =
    React.useContext(FavoritesContext);
  const { colors } = useTheme();

  const getRecipes = async () => {
    if (searchQuery.trim() === "") {
      setSearchRes([]);
      return;
    }

    let url = "";
    if (searchType === "ingredients") {
      url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=96dd1ac03932492e8c229808d9539ab4&ingredients=${searchQuery}&number=10`;
    } else {
      url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=96dd1ac03932492e8c229808d9539ab4&query=${searchQuery}&number=10`;
    }
    const res = await fetch(url);
    const data = await res.json();

    try {
      const result = searchType === "ingredients" ? data : data.results;

      if (Array.isArray(result)) {
        setSearchRes(result);
      } else {
        setSearchRes([]);
        console.error("Error in API response format for ingredients search");
      }
    } catch (error) {
      setSearchRes([]);
      console.error("Error processing API response:", error);
    }
  };

  const handleRecipeClick = (recipe) => {
    navigation.navigate("RecipeDetails", { recipe });
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {searchRes.map((recipe, index) => {
          return (
            <TouchableRipple
              key={index}
              onPress={() => handleRecipeClick(recipe)}
              rippleColor="rgba(0, 0, 0, .32)"
            >
              <Card style={styles.card}>
                <Card.Cover
                  source={{ uri: `${recipe.image}` }}
                  style={styles.cardCover}
                />
                <IconButton
                  icon={isFavorite(recipe.id) ? "bookmark" : "bookmark-outline"}
                  color={isFavorite(recipe.id) ? colors.primary : colors.text}
                  size={24}
                  style={styles.bookmarkIcon}
                  onPress={() => {
                    if (isFavorite(recipe.id)) {
                      removeFavorite(recipe.id);
                    } else {
                      addFavorite(recipe);
                    }
                  }}
                />
                <Card.Content style={styles.cardContent}>
                  <Text numberOfLines={2} style={styles.recipeTitle}>
                    {recipe.title}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    paddingBottom: 20
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    elevation: 5,
    backgroundColor: "#fff"
  },
  cardCover: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  bookmarkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center"
  }
});

export default SearchFunc;
