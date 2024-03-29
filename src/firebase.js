// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSY3F1hkwbOWGIsfDxs8Yy-Idiyr59ewY",
  authDomain: "finance-tracker-ddf76.firebaseapp.com",
  projectId: "finance-tracker-ddf76",
  storageBucket: "finance-tracker-ddf76.appspot.com",
  messagingSenderId: "397275897837",
  appId: "1:397275897837:web:bada73167d7c5d33d551e4",
  measurementId: "G-HH822XS6F6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
