import { Injectable } from '@angular/core';

import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth, signOut, User } from "firebase/auth";
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firebase: FirebaseService) { }

  updateUserInfo() {
    const docRef = doc(this.firebase.db, 'users', this.currentUser.uid)
    getDoc(docRef).then(snap => {
      this.currentUser = snap.data();
    })
  }

  isNewUser(user: User) {
    const docRef = doc(this.firebase.db, 'users', user.uid)
    getDoc(docRef).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }

  createNewUser(user: User) {
    const docRef = doc(this.firebase.db, 'users', user.uid)
    setDoc(docRef, {
      displayName: user.displayName,
      email: user.email,
      pfp: user.photoURL,
      family: []
    }).then(() => {
      this.getUserInfo(user);
    });
  }

  getUserInfo(user: User) {
    const docRef = doc(this.firebase.db, 'users', user.uid)
    getDoc(docRef).then(snap => {
      this.currentUser = snap.data();
    });
  }

  logoutUser() {
    const auth = getAuth();
    signOut(auth).then(() => {
      goto('/', { replaceState: true })
      this.currentUser = {};
    }).catch((error) => {
      console.error('Could not logout')
      // An error happened.
    });
  }
}
