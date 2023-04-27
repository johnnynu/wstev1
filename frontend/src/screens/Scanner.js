import React, { useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SafeAreaView, StyleSheet, Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Avatar } from "react-native-paper";

function Scanner() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanData, setScanData] = React.useState();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    data = data.slice(1);
    setScanData(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);

    //const fetch = require("node-fetch");
    let temp = "health%5B0%5D=alcohol-free";
    const url =
      "https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser?upc=" +
      data;
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": "7462605e14msh2956f2589d85e7cp199512jsnbf0c8dd8c4f4",
        "X-RapidAPI-Host": "edamam-food-and-grocery-database.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const data = JSON.parse(result)
      console.log(data['hints'][0]['food']['label']);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
      >
        <View style={styles.iconContainer}>
          <Avatar.Icon
            size={64}
            icon="target-variant"
            style={{ backgroundColor: "transparent" }}
          />
        </View>
      </BarCodeScanner>

      {scanData && (
        <Button onPress={() => setScanData(undefined)}> Scan Again? </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
    alignSelf: "center",
  },
});

export default Scanner;

/*
{scanData && setScanData(undefined)}
      {scanData && (
        <Button onPress={() => ScannedItem()}> Scan Again? </Button>
      )}
*/
