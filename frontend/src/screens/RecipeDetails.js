import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Title,
  Paragraph,
  Subheading,
  Card,
  List,
  IconButton,
  useTheme
} from "react-native-paper";
import FavoritesContext from "../components/FavoritesContext";

const RecipeDetails = ({ route }) => {
  const { recipe } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchRecipeDetailsAndInstructions();
  }, []);

  const { addFavorite, removeFavorite, isFavorite } =
    React.useContext(FavoritesContext);
  const { colors } = useTheme();

  const fetchRecipeDetailsAndInstructions = async () => {
    try {
      const [detailsRes, instructionsRes] = await Promise.all([
        fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=96dd1ac03932492e8c229808d9539ab4`
        ),
        fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=96dd1ac03932492e8c229808d9539ab4`
        )
      ]);

      const [detailsData, instructionsData] = await Promise.all([
        detailsRes.json(),
        instructionsRes.json()
      ]);

      setRecipeDetails(detailsData);
      setInstructions(instructionsData);
    } catch (error) {
      console.error("Error fetching recipe details and instructions:", error);
    }
  };

  // we call this function when the user clicks on a star
  const handleRating = (rating) => {
    setUserRating(rating);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card>
          <Card.Cover source={{ uri: recipe.image }} style={styles.cardCover} />
          <Card.Content>
            <Card.Content>
              <Title style={styles.title}>{recipe.title}</Title>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <IconButton
                    key={`star-${rating}`}
                    icon={userRating >= rating ? "star" : "star-outline"}
                    color={userRating >= rating ? "gold" : "gray"}
                    size={24}
                    onPress={() => handleRating(rating)}
                  />
                ))}
              </View>
            </Card.Content>
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
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Subheading>Ingredients</Subheading>
          {recipeDetails &&
            recipeDetails.extendedIngredients.map((ingredient, index) => (
              <List.Item
                key={index}
                title={ingredient.name}
                description={`${Math.round(ingredient.amount * 100) / 100} ${
                  ingredient.unit
                }`}
                left={() => (
                  <Avatar.Image
                    size={48}
                    source={{
                      uri: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
                    }}
                    style={styles.ingredientImage}
                  />
                )}
              />
            ))}
        </View>
        <View style={styles.section}>
          <Subheading>Instructions</Subheading>
          {instructions &&
            instructions.map((stepGroup, index) => (
              <View key={`step-group-${index}`}>
                {stepGroup.steps.map((step, idx) => (
                  <Paragraph key={`step-${idx}`}>
                    {`${step.number}. ${step.step}`}
                  </Paragraph>
                ))}
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  cardCover: {
    height: 200
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 16
  },
  section: {
    marginBottom: 24
  },
  ingredientImage: {
    marginRight: 8
  },
  bookmarkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1
  }
});

export default RecipeDetails;
