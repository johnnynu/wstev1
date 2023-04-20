import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { Button } from "react-native-paper";

const Scanner = () => {
  // states
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  // obtains camera permissions
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  // ensures permissions are present, otherwise prompts the user to do so
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  // this function sends the picture to cloud services for OCR
  const extractData = async () => {
    const vision = require("react-cloud-vision-api");
    vision.init({ auth: "AIzaSyA3j2rcSViCtMMEEtqWpHnYq8PP7LVvVP8" });
    const req = new vision.Request({
      image: new vision.Image({ base64: photo.base64 }),
      features: [
        new vision.Feature("TEXT_DETECTION", 4),
        new vision.Feature("LABEL_DETECTION", 10),
      ],
    });

    console.log("1");

    return vision.annotate(req).then((res) => {
      console.log(JSON.stringify(res.responses));
    }, (e) => {
      console.log("Error: ", e);
    });
  };

  // this function accepts the image and collects the OCR text
  const acceptPicture = () => {
    console.log("Picture Accepted");
    extractData().finally(() => {
      setPhoto(undefined);
    });
  };

  // this function takes the picture and sets 'photo' to the captured image
  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let capturedPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(capturedPhoto);
  };

  // displays the captured image and prompts the user with the option to discard
  // or accept the image that was taken
  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    //TODO:
    // add onpress functionality for accept button
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 50,
            }}
          >
            <Button icon={"check"} mode="contained" onPress={acceptPicture}>
              Accept
            </Button>

            <Button
              icon={"repeat-variant"}
              mode="contained"
              onPress={() => setPhoto(undefined)}
              style={{ marginTop: 5 }}
            >
              Retake
            </Button>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // displays the camera with the option to capture an image
  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button
          icon={"camera"}
          mode="contained"
          onPress={takePic}
          style={{ marginBottom: 50 }}
        >
          Take
        </Button>
      </View>

      <StatusBar style="auto" />
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  preview: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default Scanner;
