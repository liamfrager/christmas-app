import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { getAuth, signOut, User } from "firebase/auth";
import { FirebaseService } from './firebase.service';


type UserFunction = (user: User) => any;


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private firebaseService: FirebaseService, private router: Router) {}
  
  getCurrentUserUID() {
    return new Promise<string | undefined>((resolve, reject) => {
      const unsubscribe = this.firebaseService.auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user?.uid);
      }, reject);
    });
  }
  
  currentUser?: DocumentData | undefined  = this.getUserInfo(this.getCurrentUserUID());

  async getUserInfo(uid: string | undefined | Promise<string | undefined>) {
    uid = await uid;
    if (uid) {
      const docRef = doc(this.firebaseService.db, 'users', uid)
      const docSnap = await getDoc(docRef)
      return docSnap.data();
    } else {
      return undefined;
    }
  };

  ifUser(user: User | undefined, func: UserFunction) {
    if (user) {
      return func(user)
    } else {
      return undefined;
    }
  }

  updateUserInfo(user: User) {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    getDoc(docRef).then(snap => {
      this.currentUser = snap.data();
    })
  }

  async isNewUser(user: User): Promise<boolean> {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    try {
      await getDoc(docRef);
      return true;
    } catch (_) {
      return false;
    }
  }

  createNewUser(user: User) {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    setDoc(docRef, {
      displayName: user.displayName,
      email: user.email,
      pfp: user.photoURL,
      uid: user.uid,
      family: [],
    });
  }

  logoutUser() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Could not logout')
    });
  }
}
