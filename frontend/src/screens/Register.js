import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { db } from "../components/firebase";
import { auth, registerWithEmailAndPassword } from "../components/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import backgroundImage from "./Register.jpg";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerWithEmailAndPassword(name, email, password);
      console.log('User registered successfully!');
      const user = auth.currentUser;
      // Create a new document in the "pantries" collection for the user
      await setDoc(doc(db, "pantry", user.uid), {
        items: [{ name: "Milk", expirationDate: new Date("2023-05-31") },
        { name: "Bread", expirationDate: new Date("2023-06-01") },
        { name: "Eggs", expirationDate: new Date("2023-06-05") }]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const navigation = useNavigation();

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Name" value ={name} onChangeText={setName}/>
          <TextInput style={styles.input} placeholder="Email" value ={email} onChangeText={setEmail}/>
          <TextInput style={styles.input} placeholder="Password" value ={password} onChangeText={setPassword}secureTextEntry={true} />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.switchButtonText}>Already have an account? Log in here.</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  form: {
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
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
  switchButton: {
    alignItems: "center",
  },
  switchButtonText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default Register;
