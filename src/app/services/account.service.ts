import { Injectable } from '@angular/core';
import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import { signOut, User as FirebaseUser} from "firebase/auth";
import { FirebaseService } from './firebase.service';
import { User } from '../types';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private firebaseService: FirebaseService) {}
  
  get currentUserID(): string | undefined {
    return this.firebaseService.auth.currentUser?.uid;
  }
  
  get currentUser(): User {
    const currentUser = this.firebaseService.auth.currentUser;
    if (currentUser) {
      return {
        id: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        pfp: currentUser.photoURL,
        mood: localStorage.getItem('mood'),
        bio: localStorage.getItem('bio'),
      } as User;
    } else {
      throw Error('`currentUser` is not logged in');
    }
  };

  async getUserInfo(id: string) : Promise<User | undefined> {
    if (id) {
      const docRef = doc(this.firebaseService.db, 'users', id)
      const docSnap = await getDoc(docRef)
      return docSnap.data() as User;
    } else {
      console.error(`Could not get user info. ID is '${id}'.`);
      return undefined;
    }
  };

  createNewUser(user: FirebaseUser): User {
    const docRef = doc(this.firebaseService.db, 'users', user.uid)
    const userData = {
      displayName: user.displayName,
      searchName: user.displayName?.replace(/\s+/g, '').toLowerCase(), // remove spaces and make lowercase
      email: user.email,
      pfp: user.photoURL,
      id: user.uid,
    }
    setDoc(docRef, userData);
    return userData as User;
  }

  async setMood(emojiString: string) {
    await runTransaction(this.firebaseService.db, async (transaction) => {
      const docRef = doc(this.firebaseService.db, 'users', this.currentUserID!);
      transaction.update(docRef, {
        mood: emojiString
      });
      localStorage.setItem('mood', emojiString);
    });
  }
}
