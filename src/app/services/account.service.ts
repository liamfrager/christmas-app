import { Injectable, Injector } from '@angular/core';
import { doc, setDoc, getDoc, runTransaction, where, getDocs, query, collection } from "firebase/firestore";
import { User as FirebaseUser} from "firebase/auth";
import { FirebaseService } from './firebase.service';
import { Gift, User, UserProfile } from '../types';
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
      const displayName = localStorage.getItem('displayName') ? localStorage.getItem('displayName') : currentUser.displayName;
      return {
        id: currentUser.uid,
        displayName: displayName,
        searchName: displayName!.replace(/\s+/g, '').toLowerCase(),
        email: currentUser.email,
        pfp: currentUser.photoURL,
        mood: localStorage.getItem('mood'),
        bio: localStorage.getItem('bio'),
      } as User;
    } else {
      throw Error('`currentUser` is not logged in');
    }
  };

  async getUserInfo(id: string, extend?: boolean) : Promise<User | UserProfile | undefined> {
    if (id) {
      const docRef = doc(this.firebaseService.db, 'users', id)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data() as UserProfile;
      if (data) {
        if (extend)
          return data;
        else
          return {
            id: data.id,
            displayName: data.displayName,
            searchName: data.searchName,
            email: data.email,
            pfp: data.pfp,
          } as User;
      }
      return undefined;
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
        const friends = await this.friendsService.getFriends(this.currentUserID!);
        friends.forEach(friend => {
          const friendRef = doc(this.firebaseService.db, 'lists', friend.id, 'friends-list', this.currentUserID!);
          transaction.update(friendRef, updates);
        })
      }
    });
  }

  async deleteAccount() {
    await runTransaction(this.firebaseService.db, async (transaction) => {
      const userRef = doc(this.firebaseService.db, 'users', this.currentUserID!);
      transaction.delete(userRef);
      const settingsRef = doc(this.firebaseService.db, 'settings', this.currentUserID!);
      transaction.delete(settingsRef);
      const claimedGifts = await getDocs(query(collection(this.firebaseService.db, 'lists', this.currentUserID!, 'wish-list'), where('isClaimedByID', '!=', null)));
      claimedGifts.docs.forEach(snap => {
        const gift = snap.data() as Gift;
        const claimedRef = doc(this.firebaseService.db, 'lists', gift.isClaimedByID!, 'shopping-list', gift.id);
        transaction.update(claimedRef, {isDeleted: true});
      })
      const listsRef = doc(this.firebaseService.db, 'lists', this.currentUserID!);
      transaction.delete(listsRef);
    });
  }
}
