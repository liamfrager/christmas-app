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
    console.log('currentUser...')
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      console.log('currentUser exists')
      return JSON.parse(currentUser) as User
    }
    this.setCurrentUser()
    return this.currentUser // Too much recursion?
  };

  async setCurrentUser() {
    const id = await this.getCurrentUserID();
    const currentUser = await this.getUserInfo(id ? id : '');
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }

  async getUserInfo(id: string) : Promise<User> {
    if (id) {
      const docRef = doc(this.firebaseService.db, 'users', id)
      const docSnap = await getDoc(docRef)
      return docSnap.data() as User;
    } else {
      throw Error(`Could not get user info. ID is '${id}'.`);
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
      id: user.uid,
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
