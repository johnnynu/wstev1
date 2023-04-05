import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Home from "./src/screens/Home";
import Search from "./src/screens/Search";
import RecipeDetails from "./src/screens/RecipeDetails";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FavoritesProvider } from "./src/components/FavoritesContext";

const BottomTab = createMaterialBottomTabNavigator();
const SearchStack = createNativeStackNavigator();

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

const App = () => {
  return (
    <>
      <NavigationContainer>
        <PaperProvider>
          <FavoritesProvider>
            <BottomTab.Navigator initialRouteName="Home" shifting={true}>
              <BottomTab.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarLabel: "Home",
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={26}
                    />
                  )
                }}
              />
              <BottomTab.Screen
                name="Pantry"
                component={Home}
                options={{
                  tabBarLabel: "Pantry",
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                      name="basket"
                      color={color}
                      size={26}
                    />
                  )
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
                  )
                }}
              />
              <BottomTab.Screen
                name="Scan"
                component={Home}
                options={{
                  tabBarLabel: "Scan",
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                      name="scan-helper"
                      color={color}
                      size={26}
                    />
                  )
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
                  )
                }}
              />
            </BottomTab.Navigator>
          </FavoritesProvider>
        </PaperProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
