import React, { useState, useEffect } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text, List, Avatar, Divider } from "react-native-paper";
import axios from "axios";

const SearchFunc = ({ props }) => {
  // array variable
  const [searchRes, setSearchRes] = useState([]);

  // on load, useEffect calls the getRecipes... function
  // we add the variable 'props' to the parameters list because everytime props changes
  // SearchFunc.js rerenders thus calling the getRecipesByIngre again and again.

  useEffect(() => {
    getRecipesByIngre();
  }, [props]);

  // call to third party api with parameters given in variable "res".
  const getRecipesByIngre = async () => {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=96dd1ac03932492e8c229808d9539ab4&ingredients=${props}&number=10`
    );
    const data = await res.json();
    setSearchRes(data);
  };

  // since we are getting back 10 recipes, we map over the searchRes variable to grab each name from the 10 objects
  // Modified styling
  return (
    <View>
      <ScrollView>
        {searchRes.map((recipe) => {
          return (
            <View>
              <List.Item
                title={recipe.title}
                left={() => (
                  <Avatar.Image size={80} source={{ uri: `${recipe.image}` }} />
                )}
                titleNumberOfLines={2}
              />
              <Divider />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SearchFunc;
