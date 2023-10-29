// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}from "firebase/firestore";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDUGr6ROSTXwmH4nL1_Re3Ng3DoR3hJlw",
  authDomain: "assignmenttwoscp.firebaseapp.com",
  projectId: "assignmenttwoscp",
  storageBucket: "assignmenttwoscp.appspot.com",
  messagingSenderId: "130325104465",
  appId: "1:130325104465:web:0ed2fd49494a7d8e45b570"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)