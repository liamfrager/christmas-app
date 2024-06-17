import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { getAuth, signOut, User } from "firebase/auth";
import { FirebaseService } from './firebase.service';


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
  
  currentUser?: DocumentData | Promise<DocumentData> = this.getUserInfo(this.getCurrentUserUID());

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

  async isNewUser(user: User): Promise<boolean> {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    const res = await getDoc(docRef);
    if (res.data()) {
      return false;
    } else {
      return true;
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
    signOut(this.firebaseService.auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Could not logout')
    });
  }
}
