// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl_4fqpnrU1IdXOv5gNYX46OrT0FzUSOI",
  authDomain: "book-library-d6add.firebaseapp.com",
  projectId: "book-library-d6add",
  storageBucket: "book-library-d6add.firebasestorage.app",
  messagingSenderId: "480559481591",
  appId: "1:480559481591:web:b3c96792c7f6ff66ac09f2",
  measurementId: "G-B1K26BKHPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);