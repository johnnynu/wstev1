import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI1et03Rhh2jYAkxRyxllQf5sbMcfMdAo",
  authDomain: "wste-4086a.firebaseapp.com",
  projectId: "wste-4086a",
  storageBucket: "wste-4086a.appspot.com",
  messagingSenderId: "969414319313",
  appId: "1:969414319313:web:3b625205b50ff1dba439f0",
  measurementId: "G-K73JHVGWBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
