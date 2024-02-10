import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAznqO1n5IjhLUMlHv63c0tQSAEVguSczs",
    authDomain: "christmas-list-app-2ffd9.firebaseapp.com",
    projectId: "christmas-list-app-2ffd9",
    storageBucket: "christmas-list-app-2ffd9.appspot.com",
    messagingSenderId: "281585906242",
    appId: "1:281585906242:web:2a1bbee8fedc50ea3ef3db",
    measurementId: "G-PLLLR1JSNT"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }
}
