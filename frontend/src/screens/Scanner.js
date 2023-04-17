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

  //obtains camera persmissions
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
    const vision = require("@google-cloud/vision");

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';

    // Performs text detection on the local file
    const [result] = await client.textDetection(
      "/Users/jorge/seniorProject/code/wste/wstev1/frontend/assets/receipt.jpg"
    );
    const detections = result.textAnnotations;
    console.log("Text:");
    detections.forEach((text) => console.log(text));

    const vision = require("react-cloud-vision-api");
    vision.init({ auth: "YOUR_API_KEY" });
    const req = new vision.Request({
      image: new vision.Image({
        base64: photo,
      }),
      features: [
        new vision.Feature("TEXT_DETECTION", 4),
        new vision.Feature("LABEL_DETECTION", 10),
      ],
    });

    console.log(req);
  };

  // this function accepts the image and collects the OCR text
  const acceptPicture = () => {
    console.log("Picture Accepted");
    extractData();
  };

  // this function takes the picture and sets 'photo' to the capture image
  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let capturedPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(capturedPhoto);
  };

  // displays the capture image and prompts the user with the option to discard
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
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button icon={"check"} mode="contained" onPress={acceptPicture}>
              Accept
            </Button>

            <Button
              style={{ marginLeft: 10 }}
              icon={"repeat-variant"}
              mode="contained"
              onPress={() => setPhoto(undefined)}
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
        <Button icon={"camera"} mode="contained" onPress={takePic}>
          {" "}
          Take{" "}
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
    alignItems: "center",
    justifyContent: "center",
  },

  preview: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default Scanner;
