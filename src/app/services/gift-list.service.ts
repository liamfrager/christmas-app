import { Injectable } from '@angular/core';
import { collection, deleteField, doc, getDoc, getDocs, orderBy, query, runTransaction } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { Gift, List, NewGift, Gifts, Friend, WishLists, User, NewList } from '../types';


@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  /**
   * Fetches all the wish-lists of a given user.
   * @param userID - The user ID of the user whose wish-lists are being fetched.
   * @returns A promise that resolves to a WishLists object containing the data for the given user's wish-lists.
   */
  async getAllWishLists(user: User): Promise<WishLists> {
    const wishListsQuerySnapshot = await getDocs(collection(this.db, 'lists', user.id, 'wish-lists'));
    const wishLists: WishLists = {
      type: 'valid',
      owner: user,
      lists: wishListsQuerySnapshot.docs.map(x => x.data() as unknown as List)
    }
    return wishLists;
  }

  /**
   * Adds a list to the current user's wish-lists.
   * @param newList - A NewList object containing the data for the list being added.
   * @returns A promise that resolves to the ID of the newly created list, or null if the creation failed.
   */
  async addWishList(newList: NewList): Promise<string | undefined> {
    return await runTransaction(this.db, async (transaction) => {
      if (this.accountService.currentUserID) {
        const newListRef = doc(collection(this.db, 'lists', this.accountService.currentUserID, 'wish-lists'));
        transaction.set(newListRef, {
          ...newList,
          id: newListRef.id,
        });
        return newListRef.id;
      }
      return undefined;
    })
  }

  /**
   * Deletes a list from the current user's wish-lists, updating shopping lists claiming that gifts from that list.
   * @param list - A List object containing the data for the list being deleted.
   */
  async deleteWishList(list: List) {
    await runTransaction(this.db, async (transaction) => {
      // Delete all gifts from list
      const giftsRef = collection(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', list.id, 'gifts');
      const giftsSnap = await getDocs(giftsRef);
      giftsSnap.docs.forEach(gift => this.deleteGiftFromWishList(gift.data() as unknown as Gift));
      // Delete list
      if (this.accountService.currentUserID) {
        const listRef = doc(this.db, 'lists', this.accountService.currentUserID, 'wish-lists', list.id);
        transaction.delete(listRef);
      }
    });
  }

  /**
   * Updates a list in the database.
   * @param oldList - A List object containing the data for the list to be updated.
   * @param newList - A NewList object containing the updated data for the list.
   */
  async updateList(oldList: List, newList: NewList) {
    await runTransaction(this.db, async (transaction) => { 
      const listRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', oldList.id);
      transaction.update(listRef, {...oldList, ...newList, giftsByUser: null}); // giftsByUser isn't saved in database, so must be null.
    });
  }

  /**
   * Fetches the wish-list of a given user.
   * @param userID - The user ID of the user whose wish-list is being fetched.
   * @param listID - The list ID of the wish-list to fetch.
   * @returns A promise that resolves to a List object containing the data for the given user's wish-list.
   */
  async getWishListInfo(userID: string, listID: string): Promise<List | undefined> {
    const wishQuerySnapshot = await getDoc(doc(this.db, 'lists', userID, 'wish-lists', listID));
    const giftsQuerySnapshot = await getDocs(collection(this.db, 'lists', userID, 'wish-lists', listID, 'gifts'));
    const data = wishQuerySnapshot.data();
    const gifts = giftsQuerySnapshot.docs;
    if (data) {
      let user = data['owner'];
      // Create list
      let list: List = {
        id: data['id'],
        name: data['name'],
        type: 'wish',
        owner: user,
        giftsByUser: gifts.length > 0 ?
        {
          [user.id]: {
            gifts: new Map() as Gifts,
            user: user,
          }
        } : undefined
      }
      // Add all gifts to list
      giftsQuerySnapshot.forEach((doc) => {
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
        name: 'shopping',
        id: owner!.id,
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
   * @param listID - The list ID of the wish-list to add the gift to.
   */
  async addGiftToWishList(gift: NewGift, listID: string) {
    await runTransaction(this.db, async (transaction) => {
      const giftRef = doc(collection(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', listID, 'gifts'))
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
      const wishRef = doc(this.db, 'lists', gift.isWishedByID, 'wish-lists', gift.isWishedOnListID, 'gifts', gift.id);
      transaction.update(wishRef, {
        isClaimedByID: this.accountService.currentUserID!,
      });
    });
  }

  /**
   * Creates a new gift in the current user's shopping-list.
   * @param gift - A Gift object containing the data for the gift being claimed.
   * @param friend - The friend the gift is for.
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
    console.log('updating doc')
    await runTransaction(this.db, async (transaction) => {
      let refs = [];
      
      if (oldGift.isCustom) {
        const shoppingRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list', oldGift.id);
        refs.push(shoppingRef);
      } else {
        if (oldGift.isWishedOnListID !== newGift.isWishedOnListID) {
          const newWishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', newGift.isWishedOnListID, 'gifts', oldGift.id);
          transaction.set(newWishRef, {...oldGift, ...newGift});
          const oldWishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', oldGift.isWishedOnListID, 'gifts', oldGift.id);
          transaction.delete(oldWishRef);
        } else {
          const wishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', oldGift.isWishedOnListID, 'gifts', oldGift.id);
          refs.push(wishRef);
        }
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
   * @param gift - A Gift object containing the data for the gift being deleted.
   */
  async deleteGiftFromWishList(gift: Gift) {
    await runTransaction(this.db, async (transaction) => {
      // update current user's wish-list
      console.log(gift);
      const wishRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', gift.isWishedOnListID, 'gifts', gift.id);
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
   * @param gift - A Gift object containing the data for the gift being deleted.
   */
  async deleteGiftFromShoppingList(gift: Gift) {
    await runTransaction(this.db, async (transaction) => {
      // update current user's shopping-list
      const shoppingRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'shopping-list', gift.id);
      transaction.delete(shoppingRef);

      // update isWishedBy user's wish-list
      if (!gift.isCustom) {
        const wishRef = doc(this.db, 'lists', gift.isWishedByID, 'wish-lists', gift.isWishedOnListID, 'gifts', gift.id);
        transaction.update(wishRef, {isClaimedByID: deleteField()})
      }
    });
  }
}
