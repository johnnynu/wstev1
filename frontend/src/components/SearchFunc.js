import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, List } from "react-native-paper";
import axios from "axios";

const SearchFunc = () => {
  const [searchRes, setSearchRes] = useState([]);

  useEffect(() => {
    getRecipesByIngre();
  }, []);

  const getRecipesByIngre = async () => {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=96dd1ac03932492e8c229808d9539ab4&ingredients=banana&number=10`
    );
    const data = await res.json();
    setSearchRes(data);
  };
  return (
    <View>
      {searchRes.map((recipe) => {
        return (
          <View>
            <List.Image variant="image" source={{ uri: `${recipe.image}` }} />
            <Text>{recipe.title}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SearchFunc;
