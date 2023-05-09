import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";
import { logInWithEmailAndPassword } from "../components/firebase";
import { useNavigation } from "@react-navigation/native";

import backgroundImage from "./Login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await logInWithEmailAndPassword(email, password);
      console.log("User logged in successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back!</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
  },
  form: {
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#5D3FD3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default Login;
