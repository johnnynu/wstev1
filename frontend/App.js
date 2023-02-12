import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Home from "./src/screens/Home";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// const Stack = createNativeStackNavigator();;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomTab = createMaterialBottomTabNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <PaperProvider>
          <BottomTab.Navigator
            initialRouteName="Home" component={Home}
            >
              <BottomTab.Screen
                name="Search"
                component= {Home} // Change to search page
                options={{
                  tabBarLabel: 'Search',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name = "home" color={color} size={26} /> // Change Icon to search icon
                  ),
                }}
              />
              <BottomTab.Screen
                name="Scan"
                component= {Home} // Change to Scan page
                options={{
                  tabBarLabel: 'Scan',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name = "home" color={color} size={26} /> // Change Icon to Scan icon
                  ),
                }}
              />
              <BottomTab.Screen
                name="Extras"
                component= {Home} // Change to Extras page
                options={{
                  tabBarLabel: 'Extras',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name = "home" color={color} size={26} /> // Change Icon to extras icon
                  ),
                }}
              />
              <BottomTab.Screen
                name="Account"
                component= {Home} // Change to Account page
                options={{
                  tabBarLabel: 'Account',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name = "home" color={color} size={26} /> // Change Icon to Account icon
                  ),
                }}
              />
               <BottomTab.Screen
                name="Account"
                component= {Home} // Change to Account page
                options={{
                  tabBarLabel: 'Account',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name = "home" color={color} size={26} /> // Change Icon to Account icon
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
