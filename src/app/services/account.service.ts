import { Injectable } from '@angular/core';

import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth, signOut, User } from "firebase/auth";
import { FirebaseService } from './firebase.service';

type UserFunction = (user: User) => any;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firebase: FirebaseService) { }

  currentUser?: User

  ifUser(user: User | undefined, func: UserFunction) {
    if (user) {
      return func(user)
    } else {
      return undefined;
    }
  }

  updateUserInfo(user: User) {
    const docRef = doc(this.firebase.db, 'users', user.uid)
    getDoc(docRef).then(snap => {
      // this.currentUser = snap.data();
    })
  }

  async isNewUser(user: User): Promise<boolean> {
    const docRef = doc(this.firebase.db, 'users', user.uid)
    try {
      await getDoc(docRef);
      return true;
    } catch (_) {
      return false;
    }
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
      // this.currentUser = snap.data();
    });
  }

  // logoutUser() {
  //   const auth = getAuth();
  //   signOut(auth).then(() => {
  //     goto('/', { replaceState: true })
  //     this.currentUser = {};
  //   }).catch((error) => {
  //     console.error('Could not logout')
  //     // An error happened.
  //   });
  // }
}
