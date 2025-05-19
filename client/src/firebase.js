// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: "AIzaSyA1fb-05gT2faBraOT1HKX3y2sWhUnll3k",
  authDomain: "fiton-acfda.firebaseapp.com",
  projectId: "fiton-acfda",
  storageBucket: "fiton-acfda.appspot.com",
  messagingSenderId: "841132274703",
  appId: "1:841132274703:web:1c6f8e8b74dc672bc7df7a"
  //measurementId: process.env.
});

// Initialize Firebase

export const auth = app.auth();
export default app