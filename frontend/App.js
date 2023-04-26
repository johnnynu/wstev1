import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Home from "./src/screens/Home";
import Search from "./src/screens/Search";
import RecipeDetails from "./src/screens/RecipeDetails";
import AddItemScreen from "./src/screens/AddItem";
import PantryItem from "./src/screens/PantryItem";
import Pantry from "./src/screens/Pantry";

import ChatLogin from "./src/screens/ChatLogin";
import ChatAssistant from "./src/screens/ChatAssistant";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FavoritesProvider } from "./src/components/FavoritesContext";
import { ChatGptProvider } from "react-native-chatgpt";

const BottomTab = createMaterialBottomTabNavigator();
const SearchStack = createNativeStackNavigator();
const PantryStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      component={Home}
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);

const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="SearchMain"
      component={Search}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="RecipeDetails"
      component={RecipeDetails}
      options={{ title: "Recipe Details" }}
    />
  </SearchStack.Navigator>
);

const PantryStackNavigator = () => (
  <PantryStack.Navigator>
    <PantryStack.Screen
      name="PantryMain"
      component={Pantry}
      options={{ headerShown: false }}
    />
    <PantryStack.Screen
      name="AddItem"
      component={AddItemScreen}
      options={{ headerShown: false }} // Hide the default header
    />
    <PantryStack.Screen
      name="PantryItem"
      component={PantryItem}
      options={{ headerShown: false }} // Hide the default header
    />
  </PantryStack.Navigator>
);

const App = () => {
  return (
    <>
      <NavigationContainer>
        <ChatGptProvider>
          <PaperProvider>
            <FavoritesProvider>
              <BottomTab.Navigator initialRouteName="Home" shifting={true}>
                <BottomTab.Screen
                  name="Home"
                  component={HomeStackNavigator}
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="home"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
                <BottomTab.Screen
                  name="Pantry"
                  component={PantryStackNavigator}
                  options={{
                    tabBarLabel: "Pantry",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="basket"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
                <BottomTab.Screen
                  name="Search"
                  component={SearchStackNavigator}
                  options={{
                    tabBarLabel: "Search",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="archive-search"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />

                <BottomTab.Screen
                  name="Scan"
                  component={ChatLogin}
                  options={{
                    tabBarLabel: "Scan",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="scan-helper"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />

                <BottomTab.Screen
                  name="Account"
                  component={Home}
                  options={{
                    tabBarLabel: "Account",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="account"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
              </BottomTab.Navigator>
            </FavoritesProvider>
          </PaperProvider>
        </ChatGptProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
