import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { collection, doc, runTransaction, where, query, getDocs, deleteField, getDoc } from 'firebase/firestore';
import { Friend, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {}
  db = this.firebaseService.db;
  currentUser = this.accountService.currentUser;

  /**
   * Returns whether the given user is friends with the current user.
   * @param - The id of the friend.
   * @returns A promise that resolves to boolean indicating whether the given user is a friend.
   */
  async isFriend(id: string): Promise<boolean> {
    const friendRef = doc(this.db, "lists", this.currentUser.id, "friends-list", id);
    const friendSnap = await getDoc(friendRef);
    const friend = friendSnap.data() as Friend;
    if (friend && friend.status === 'friends') {
      return true;
    }
    return false;
  }

  /**
   * Fetches a friend with the given id. Returns undefined if the id is invalid.
   * @param - The id of the friend.
   * @returns A promise that resolves to a Friend object or undefined.
   */
  async getFriend(id: string): Promise<Friend | undefined> {
    const friendRef = doc(this.db, "lists", this.currentUser.id, "friends-list", id);
    const friendSnap = await getDoc(friendRef);
    const friend = friendSnap.data() as Friend;
    if (friend) {
      return friend;
    }
    return undefined;
  }

  /**
   * Fetches the friends of the current user.
   * @returns A promise that resolves to an array of Friend objects.
   */
  async getFriends(): Promise<Friend[]> {
    const friendsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"), where('status', '==', 'friends'));
    const friends = await getDocs(friendsQ);
    if (friends.docs.length == 0) {
      return [];
    }
    return friends.docs.map(doc => doc.data()) as Array<Friend>;
  }

  /**
   * Fetches the incoming friend requests of the current user.
   * @returns A promise that resolves to an array of Friend objects.
   */
  async getFriendRequests(): Promise<Friend[]> {
    const friendRequestsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"), where('status', '==', 'incoming'));
    const friendRequests = await getDocs(friendRequestsQ);
    return friendRequests.docs.map(doc => doc.data()) as Array<Friend>;
  }

  /**
   * Fetches all the friends and incoming/outgoing friend requests of the current user.
   * @returns A promise that resolves to an array of Friend objects.
   */
  async getAllFriendsAndRequests(): Promise<Friend[]> {
    const allFriendsQ = query(collection(this.db, "lists", this.currentUser.id, "friends-list"));
    const allFriends = await getDocs(allFriendsQ);
    return allFriends.docs.map(doc => doc.data()) as Array<Friend>;
  }

  /**
   * Sends a friend request to a given user.
   * @param newFriend - The User to send the friend request to.
   */
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

  /**
   * Accepts a friend request from the given user.
   * @param newFriend - The User whose friend request is being accepted.
   */
  async acceptFriendRequest(newFriend: User) {
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

  /**
   * Removes the given User as a friend or rejects their incoming friend-request.
   * @param friend - The User whose friendship is being removed.
   */
  async removeFriend(friend: User) {
    try {
      await runTransaction(this.db, async (transaction) => {
        // Remove friend from current user's friends-list.
        const friendRef = doc(this.db, "lists", this.currentUser.id, "friends-list", friend.id);
        transaction.delete(friendRef);
        // Remove current user from friend's friends-list.
        const userAsFriendRef = doc(this.db, "lists", friend.id, "friends-list", this.currentUser.id);
        transaction.delete(userAsFriendRef);
        // Remove friend's gifts from current user's shopping-list.
        const friendGiftsInUserShoppingListQ = query(collection(this.db, "lists", this.currentUser.id, "shopping-list"), where('isWishedByID', '==', friend.id));
        const friendGiftsInUserShoppingList = await getDocs(friendGiftsInUserShoppingListQ)
        friendGiftsInUserShoppingList.forEach(doc => {
          transaction.delete(doc.ref);
        });
        // Unclaim gifts in friend's wish-list.
        const userGiftsInFriendWishListQ = query(collection(this.db, "lists", friend.id, "wish-list"), where('isClaimedByID', '==', this.currentUser.id))
        const userGiftsInFriendWishList = await getDocs(userGiftsInFriendWishListQ)
        userGiftsInFriendWishList.forEach(doc => {
          transaction.update(doc.ref, {
            status: deleteField(),
            isClaimedByID: deleteField(),
          });
        });
      });
      console.log("Friend successfully removed.");
    } catch (e) {
      console.error("Error removing friend: ", e);
    }
  }
}
