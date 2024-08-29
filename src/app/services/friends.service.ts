import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { collection, doc, updateDoc, addDoc, runTransaction, where, query, getDocs } from 'firebase/firestore';
import { Friend, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {}
  db = this.firebaseService.db;
  currentUser = this.accountService.currentUser;

  async getFriends(): Promise<Friend[]> {
    const friendsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"), where('status', '==', 'friends'));
    const friends = await getDocs(friendsQ);
    if (friends.docs.length == 0) {
      return [];
    }
    return friends.docs.map(doc => doc.data()) as Array<Friend>;
  }

  async getFriendRequests(): Promise<Friend[]> {
    const friendRequestsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"), where('status', '==', 'incoming'));
    const friendRequests = await getDocs(friendRequestsQ);
    return friendRequests.docs.map(doc => doc.data()) as Array<Friend>;
  }

  async getAllFriendsAndRequests(): Promise<Friend[]> {
    const allFriendsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"));
    const allFriends = await getDocs(allFriendsQ);
    return allFriends.docs.map(doc => doc.data()) as Array<Friend>;
  }

  async sendFriendrequest(newFriend: User) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const newFriendRef = doc(collection(this.db, "lists", this.currentUser.id, "friends-list"), newFriend.id);
        transaction.set(newFriendRef, {
          ...newFriend,
          status: 'outgoing',
        });

        const newFriendRequestRef = doc(collection(this.db, "lists", newFriend.id, "friends-list"), this.currentUser.id);
        transaction.set(newFriendRequestRef, {
          ...this.currentUser,
          status: 'incoming',
        });
      });
      console.log("Friend request successfully sent.");
    } catch (e) {
      console.error("Error sending friend request: ", e);
    }
  }

  async acceptFriendRequest(newFriend: Friend) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const friendRef = doc(this.db, "lists", this.currentUser.id, "friends-list", newFriend.id);
        transaction.update(friendRef, {
          status: 'friends',
        });

        const friendRequestRef = doc(this.db, "lists", newFriend.id, "friends-list", this.currentUser.id);
        transaction.update(friendRequestRef, {
          status: 'friends',
        });
      });
      console.log("Friend successfully added.");
    } catch (e) {
      console.error("Error adding friend: ", e);
    }
  }

  async removeFriend(friend: User) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const friendRef = doc(this.db, "lists", this.currentUser.id, "friends-list", friend.id);
        transaction.delete(friendRef);

        const userAsFriendRef = doc(this.db, "lists", friend.id, "friends-list", this.currentUser.id);
        transaction.delete(userAsFriendRef);
      });
      console.log("Friend successfully removed.");
    } catch (e) {
      console.error("Error removing friend: ", e);
    }
  }
}
