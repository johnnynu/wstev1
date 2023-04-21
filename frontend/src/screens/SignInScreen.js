import React, { useState } from "react";
import { View, Text } from "react-native";
import { GoogleSigninButton } from "react-native-google-signin";
import {
  signInWithGoogle,
  signOutFromGoogle
} from "../components/googleSignIn";

function SignInScreen() {
  const [user, setUser] = useState(null);

  async function handleSignIn() {
    await signInWithGoogle();
    const currentUser = await auth().currentUser;
    setUser(currentUser);
  }

  async function handleSignOut() {
    await signOutFromGoogle();
    setUser(null);
  }

  if (!user) {
    return (
      <View>
        <Text>You are not signed in</Text>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleSignIn}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome, {user.displayName}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

export default SignInScreen;
