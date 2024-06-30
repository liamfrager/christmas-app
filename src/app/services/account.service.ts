import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { getAuth, signOut, User as FirebaseUser} from "firebase/auth";
import { FirebaseService } from './firebase.service';
import { User } from '../types';


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
  
  get currentUser(): Promise<User> {
    let getCurrentUser = async () : Promise<User> => {
      const uid = await this.getCurrentUserUID()
      return await this.getUserInfo(uid ? uid : '');
    }
    return getCurrentUser()
  };

  async getUserInfo(uid: string) : Promise<User> {
    if (uid == '') {
      throw Error(`Could not get user info. UID is blank.`);
    } else if (uid) {
      const docRef = doc(this.firebaseService.db, 'users', uid)
      const docSnap = await getDoc(docRef)
      return docSnap.data() as User;
    } else {
      throw Error(`Could not get user info. UID is ${uid}.`);
    }
  };

  async isNewUser(user: FirebaseUser): Promise<boolean> {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    const res = await getDoc(docRef);
    return res.data() ? false : true;
  }

  createNewUser(user: FirebaseUser) {
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
