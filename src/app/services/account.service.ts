import { Injectable, Injector } from '@angular/core';
import { doc, setDoc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { signOut, User as FirebaseUser} from "firebase/auth";
import { FirebaseService } from './firebase.service';
import { Settings, User } from '../types';
import { FriendsService } from './friends.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private firebaseService: FirebaseService, private injector: Injector) {}
  private get friendsService(): FriendsService {
    return this.injector.get(FriendsService);
  }
  
  get currentUserID(): string | undefined {
    return this.firebaseService.auth.currentUser?.uid;
  }
  
  get currentUser(): User {
    const currentUser = this.firebaseService.auth.currentUser;
    if (currentUser) {
      return {
        id: currentUser.uid,
        displayName: localStorage.getItem('displayName') ? localStorage.getItem('displayName') : currentUser.displayName,
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

  async updateProfile(updates: any) {
    await runTransaction(this.firebaseService.db, async (transaction) => {
      const docRef = doc(this.firebaseService.db, 'users', this.currentUserID!);
      transaction.update(docRef, updates);
      if (updates.displayName !== this.currentUser.displayName) {
        console.log('updating display name');
        const friends = await this.friendsService.getFriends();
        friends.forEach(friend => {
          const friendRef = doc(this.firebaseService.db, 'lists', friend.id, 'friends-list', this.currentUserID!);
          transaction.update(friendRef, updates);
        })
      }
    });
  }

  defaultSettings: Settings = {
    showHeader : true,
  }

  async getSettings(): Promise<Settings> {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.currentUserID!);
    const settingsSnap = await getDoc(settingsRef);
    const settings = settingsSnap.data() as Settings;
    if (!settings) {
      await setDoc(settingsRef, this.defaultSettings);
      return this.defaultSettings;
    }
    return settings;
  }

  async updateSettings(updates: any) {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.currentUserID!);
    updateDoc(settingsRef, updates);
    const settings = JSON.parse(localStorage.getItem('settings')!) as Settings;
    localStorage.setItem('settings', JSON.stringify({...settings, ...updates}));
  }
}
