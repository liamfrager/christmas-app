// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAznqO1n5IjhLUMlHv63c0tQSAEVguSczs",
    authDomain: "christmas-list-app-2ffd9.firebaseapp.com",
    projectId: "christmas-list-app-2ffd9",
    storageBucket: "christmas-list-app-2ffd9.appspot.com",
    messagingSenderId: "281585906242",
    appId: "1:281585906242:web:2a1bbee8fedc50ea3ef3db",
    measurementId: "G-PLLLR1JSNT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);