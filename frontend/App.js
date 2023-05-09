import  {View, TouchableOpacity,Text,Button,useEffect, useState } from "react";
import { useNavigation,NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ChatGptProvider } from "react-native-chatgpt";
import { FavoritesProvider } from "./src/components/FavoritesContext";
//import { db } from "./src/components/firebase";

//import { db } from '@react-native-firebase/firestore';

//import { onSnapshot, deleteDoc, doc, collection } from 'firebase/firestore';
//import firebase from '@react-native-firebase/app';

//import { db } from "./src/components/firebase";
//import { db } from '@react-native-firebase/firestore';
import Home from "./src/screens/Home";
import Search from "./src/screens/Search";
import RecipeDetails from "./src/screens/RecipeDetails";
import AddItemScreen from "./src/screens/AddItem";
import PantryItem from "./src/screens/PantryItem";
import Pantry from "./src/screens/Pantry";
import ChatAssistant from "./src/screens/ChatAssistant";
import Scanner from "./src/screens/Scanner";
import Charity from "./src/screens/Charity";
import Expiration from "./src/screens/Expiration";
//import { onSnapshot, deleteDoc, doc, collection } from 'firebase/firestore';
//import firebase from '@react-native-firebase/app';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import auth from './src/components/firebase';
import firebase from './src/components/firebase';
import useAuth from "./src/components/useAuth";
import EmptyScreen from './src/screens/EmptyScreen';
import { logout } from "./src/components/firebase";
import { handleLogout } from "./src/components/handleLogout";























const BottomTab = createMaterialBottomTabNavigator();
const SearchStack = createNativeStackNavigator();
const PantryStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ExpirationStack = createNativeStackNavigator();
const UserSign = createNativeStackNavigator();
const Stack = createNativeStackNavigator();




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
      options={{ headerShown: false }}
    />
  </SearchStack.Navigator>
);

const ExpirationStackNavigator = () => {
  return (
    <ExpirationStack.Navigator>
      <ExpirationStack.Screen
        name="Expiration"
        component={Expiration}
        options={{ headerShown: false }}
      />
    </ExpirationStack.Navigator>
  );
};
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
           
        }}
      />
    </HomeStack.Navigator>
  );
};



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
      options={{ headerShown: false }}
    />
    <PantryStack.Screen
      name="PantryItem"
      component={PantryItem}
      options={{ headerShown: false }}
    />
    <PantryStack.Screen
      name="RecipeDetails"
      component={RecipeDetails}
      options={{ headerShown: false }}
    />
  </PantryStack.Navigator>
);
const AuthStackNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="Logout"
        component={EmptyScreen}
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="logout"
              color={color}
              size={26}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => handleLogout()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const user = useAuth();

  return (
    <NavigationContainer>
      {user ? (
        <ChatGptProvider>
          <PaperProvider>
            <FavoritesProvider>
              <BottomTab.Navigator initialRouteName="Home" shifting={true}>
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
                  component={ChatAssistant}
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
                  name="Charity"
                  component={Charity}
                  options={{
                    tabBarLabel: "Charity",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="map"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
                <BottomTab.Screen
                  name="Ex"
                  component={ExpirationStackNavigator}
                  options={{
                    tabBarLabel: "Ex",
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="delete"
                        color={color}
                        size={26}
                      />
                    ),
                  }}
                />
                <BottomTab.Screen
  name="Logout"
  options={{
    tabBarLabel: "Logout",
    tabBarIcon: ({ color }) => (
      <MaterialCommunityIcons
        name="logout"
        color={color}
        size={26}
      />
    ),
    tabBarButton: (props) => (
      <TouchableOpacity
        {...props}
        onPress={() => handleLogout(navigation)}
      />
    ),
  }}
  component={EmptyScreen}
/>
              </BottomTab.Navigator>
            </FavoritesProvider>
          </PaperProvider>
        </ChatGptProvider>
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;




              

