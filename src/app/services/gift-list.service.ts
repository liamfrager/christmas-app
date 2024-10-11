import { Injectable } from '@angular/core';
import { collection, deleteField, doc, DocumentData, getDocs, orderBy, query, QuerySnapshot, runTransaction } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { Gift, List, NewGift, Gifts, Friend, User } from '../types';


@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  /**
   * Fetches the wish-list of a given user.
   * @param userID - The user ID of the user whose wish-list is being fetched.
   * @returns A promise that resolves to a List object containing the data for the given user's wish-list.
   */
  async getWishListInfo(userID: string): Promise<List | undefined> {
    const wishQuerySnapshot = await getDocs(collection(this.db, 'lists', userID, 'wish-list'));
    let user = await this.accountService.getUserInfo(userID);
    if (user) {
      // Create list
      let list: List = {
        type: 'wish',
        owner: user,
        giftsByUser: wishQuerySnapshot.docs.length > 0 ?
        {
          [user.id]: {
            gifts: new Map() as Gifts,
            user: user,
          }
        } : undefined
      }
      // Add all gifts to list
      wishQuerySnapshot.forEach((doc) => {
        list.giftsByUser![userID].gifts.set(doc.data()['id'], doc.data() as Gift);
      });
      return list;
    }
    return undefined;
  }

  /**
   * Fetches the current user's shopping-list.
   * @returns A promise that resolves to a List object containing the data for the current user's shopping-list.
   */
  async getShoppingListInfo(): Promise<List | undefined> {
    if (this.accountService.currentUserID) {
      // Get all gifts from shopping-list
      const shoppingQuerySnapshot = await getDocs(query(collection(this.db, 'lists', this.accountService.currentUserID, 'shopping-list'), orderBy('isWishedByUser')));
      // Convert DocumentData to List
      const owner = await this.accountService.getUserInfo(this.accountService.currentUserID)
      let list: List = {
        type: 'shopping',
        owner: owner!,
        giftsByUser: shoppingQuerySnapshot.docs.length > 0 ? {} : undefined,
      };

      for (let i = 0; i < shoppingQuerySnapshot.docs.length; i++) {
        const gift = shoppingQuerySnapshot.docs[i].data() as Gift;
        const userID = gift.isWishedByID;
        if (!list.giftsByUser![userID] && gift.isWishedByUser) { // If first gift in array wished by a user
          list.giftsByUser![userID] = {
            user: gift.isWishedByUser, // Add user info to List
            gifts: new Map() as Gifts,
          }
        }
        list.giftsByUser![userID].gifts.set(gift.id, gift);
      }
      return list;
    }
    return undefined;
  }

  /**
   * Adds a gift to the current user's wish-list.
   * @param gift - A NewGift object containing the data for the gift being added.
   */
  async addGiftToWishList(gift: NewGift) {
    await runTransaction(this.db, async (transaction) => {
      const giftRef = doc(collection(this.db, 'lists', this.accountService.currentUserID!, 'wish-list'))
      transaction.set(giftRef, {
        ...gift,
        id: giftRef.id,
      });
    })
  }

  /**
   * Claims a gift for the current user.
   * @param gift - A Gift object containing the data for the gift being claimed.
   */
  async addGiftToShoppingList(gift: Gift) {
    await runTransaction(this.db, async (transaction) => {
      // update current user's shopping-list
      const shoppingRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list', gift.id);
      transaction.set(shoppingRef, {
        ...gift,
        isWishedByUser: await this.accountService.getUserInfo(gift.isWishedByID),
        status: 'claimed',
      });
      
      // update isWishedBy user's wish-list
      const wishRef = doc(this.db, 'lists', gift.isWishedByID, 'wish-list', gift.id);
      transaction.update(wishRef, {
        isClaimedByID: this.accountService.currentUserID!,
      });
    });
  }

  /**
   * Creates a new gift in the current user's shopping-list.
   * @param gift - A Gift object containing the data for the gift being claimed.
   */
  async createGiftInShoppingList(gift: NewGift, friend: Friend) {
    await runTransaction(this.db, async (transaction) => {
      const giftRef = doc(collection(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list'));
      transaction.set(giftRef, {
        ...gift,
        id: giftRef.id,
        isWishedByUser: friend,
        status: 'claimed',
        isCustom: true,
      });
    });
  }

  /**
   * Updates a gift in the database.
   * @param oldGift - A Gift object containing the data for the gift to be updated.
   * @param newGift - A NewGift object containing the updated data for the gift.
   */
  async updateGift(oldGift: Gift, newGift: NewGift) {
    await runTransaction(this.db, async (transaction) => {
      let refs = [];
      
      if (oldGift.isCustom) {
        const shoppingRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list', oldGift.id);
        refs.push(shoppingRef);
      } else {
        const wishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-list', oldGift.id);
        refs.push(wishRef);
        if (oldGift.isClaimedByID) {
          const shoppingRef = doc(this.db, 'lists', oldGift.isClaimedByID, 'shopping-list', oldGift.id);
          refs.push(shoppingRef);
        }
      }

      refs.forEach(ref => {
        transaction.update(ref, newGift);
      })
    });
  }


  /**
   * Deletes a gift from the current user's wish-list, updating shopping lists claiming that gift.
   * @param gift - A Gift object containing the data for the gift being claimed.
   */
  async deleteGiftFromWishList(gift: Gift) {
    await runTransaction(this.db, async (transaction) => {
      // update current user's wish-list
      const wishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-list', gift.id);
      transaction.delete(wishRef);
      
      // update isClaimedBy user's shopping-list
      if (gift.isClaimedByID) {
        const shoppingRef = doc(this.db, 'lists', gift.isClaimedByID, 'shopping-list', gift.id);
        transaction.update(shoppingRef, {
          isDeleted: true,
        });
      }
    });
  }

  /**
   * Deletes a gift from the current user's shopping-list, marking it as unclaimed.
   * @param gift - A Gift object containing the data for the gift being claimed.
   */
  async deleteGiftFromShoppingList(gift: Gift) {
    await runTransaction(this.db, async (transaction) => {
      // update current user's shopping-list
      const shoppingRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list', gift.id);
      transaction.delete(shoppingRef);

      // update isWishedBy user's wish-list
      if (!gift.isCustom) {
        const wishRef = doc(this.db, 'lists', gift.isWishedByID, 'wish-list', gift.id);
        transaction.update(wishRef, {isClaimedByID: deleteField()})
      }
    });
  }
}
