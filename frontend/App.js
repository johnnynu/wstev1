import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider as PaperProvider,
  BottomNavigation,
} from "react-native-paper";
import Home from "./src/screens/Home";
import Search from "./src/screens/Search";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// const Stack = createNativeStackNavigator();;
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Scanner from "./src/screens/Scanner";

const BottomTab = createMaterialBottomTabNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <PaperProvider>
          <BottomTab.Navigator initialRouteName="Home" component={Home}>
            <BottomTab.Screen
              name="Home"
              component={Home} // Change to Home page
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} /> // Change Icon to Home icon
                ),
              }}
            />
            <BottomTab.Screen
              name="Pantry"
              component={Home} // Change to Pantry page
              options={{
                tabBarLabel: "Pantry",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="basket"
                    color={color}
                    size={26}
                  /> // Change Icon to Pantry icon
                ),
              }}
            />
            <BottomTab.Screen
              name="Search"
              component={Search} // Change to Search page
              options={{
                tabBarLabel: "Search",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="archive-search"
                    color={color}
                    size={26}
                  /> // Change Icon to Search icon
                ),
              }}
            />
            <BottomTab.Screen
              name="Scan"
              component={Scanner} // Change to Scan page
              options={{
                tabBarLabel: "Scan",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="scan-helper"
                    color={color}
                    size={26}
                  /> // Change Icon to Scan icon
                ),
              }}
            />
            <BottomTab.Screen
              name="Account"
              component={Home} // Change to Account page
              options={{
                tabBarLabel: "Account",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="account"
                    color={color}
                    size={26}
                  /> // Change Icon to Account icon
                ),
              }}
            />
          </BottomTab.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
