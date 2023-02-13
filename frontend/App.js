import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider as PaperProvider,
  BottomNavigation
} from "react-native-paper";
import Home from "./src/screens/Home";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <PaperProvider>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="home" size={26} />
                )
              }}
            />
          </Tab.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
