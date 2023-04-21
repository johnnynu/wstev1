import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyDI1et03Rhh2jYAkxRyxllQf5sbMcfMdAo",
  authDomain: "wste-4086a.firebaseapp.com",
  databaseURL: "https://wste-4086a-default-rtdb.firebaseio.com",
  projectId: "wste-4086a",
  storageBucket: "wste-4086a.appspot.com",
  messagingSenderId: "969414319313",
  appId: "1:969414319313:web:3b625205b50ff1dba439f0",
  measurementId: "G-K73JHVGWBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, db };
