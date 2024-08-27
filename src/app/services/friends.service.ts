import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { collection, doc, updateDoc, addDoc, runTransaction, where, query, getDocs } from 'firebase/firestore';
import { User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {}
  db = this.firebaseService.db
  currentUser = this.accountService.currentUser

  async getFriends() {
    const friendsQ = query(collection(this.db, "lists", this.currentUser['uid'], "friends-list"), where('status', '==', 'friends'));
    const friends = await getDocs(friendsQ)
    return friends.docs.map(doc => doc.data()) as Array<User>
  }

  async getFriendRequests() {
    const friendRequestsQ = query(collection(this.db, "lists", this.currentUser['uid'], "friends-list"), where('status', '==', 'incoming'));
    const friendRequests = await getDocs(friendRequestsQ)
    return friendRequests.docs.map(doc => doc.data()) as Array<User>
  }

  async addFriend(newFriendData: User) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const newFriendRef = doc(collection(this.db, "lists", this.currentUser['uid'], "friends-list"));
        transaction.set(newFriendRef, {
          ...newFriendData,
          status: 'outgoing',
        });

        const newFriendRequestRef = doc(collection(this.db, "lists", newFriendData.id, "friends-list"));
        transaction.set(newFriendRequestRef, {
          ...this.currentUser,
          status: 'incoming',
        });
      });
      console.log("Friend successfully added");
    } catch (e) {
      console.error("Error adding friend: ", e);
    }
  }

  async deleteFriend(friend: User) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const friendRef = doc(this.db, "lists", this.currentUser['uid'], "friends-list", friend.id);
        transaction.delete(friendRef);
        const userAsFriendRef = doc(this.db, "lists", friend.id, "friends-list", this.currentUser['uid']);
        transaction.delete(userAsFriendRef);
      });
      console.log("Friend successfully removed");
    } catch (e) {
      console.error("Error removing friend: ", e);
    }
  }
}
