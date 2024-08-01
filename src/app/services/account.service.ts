import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut, User as FirebaseUser} from "firebase/auth";
import { FirebaseService } from './firebase.service';
import { User } from '../types';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private firebaseService: FirebaseService, private router: Router) {}
  
  getCurrentUserID(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
      const unsubscribe = this.firebaseService.auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user?.uid);
      }, reject);
    });
  }
  
  get currentUser(): User {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      return JSON.parse(currentUser) as User
    } else {
      throw Error('`currentUser` does not exist in local storage.')
    }
  };

  async getUserInfo(id: string) : Promise<User | null> {
    if (id) {
      const docRef = doc(this.firebaseService.db, 'users', id)
      const docSnap = await getDoc(docRef)
      return docSnap.data() as User;
    } else {
      console.error(`Could not get user info. ID is '${id}'.`);
      return null;
    }
  };

  // async isNewUser(user: FirebaseUser): Promise<boolean> {
  //   const docRef = doc(this.firebaseService.db, 'users', user.uid)
  //   const res = await getDoc(docRef);
  //   return res.data() ? false : true;
  // }

  createNewUser(user: FirebaseUser): User {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    const userData = {
      displayName: user.displayName,
      email: user.email,
      pfp: user.photoURL,
      id: user.uid,
    }
    setDoc(docRef, userData);
    return userData as User;
  }
}
