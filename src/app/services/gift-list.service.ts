import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { Gift, List, NewGift, User } from '../types';


@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  async getWishListInfo(userID: string) : Promise<List | undefined> {
    const wishQuerySnapshot = await getDocs(collection(this.db, 'lists', userID, 'wish-list'));
    let user: User = await this.accountService.getUserInfo(userID);
    if (user) {
      // create list
      let list: List = {
        type: 'wish',
        owner: user,
        giftsByUser: wishQuerySnapshot.docs.length > 0 ?
        {
          [user.id]: {
            gifts: {},
            user: user,
          }
        } : undefined
      }
      // add all gifts to list
      wishQuerySnapshot.forEach((doc) => {
        list.giftsByUser![userID].gifts[doc.data()['id']] = doc.data() as Gift;
      });
      return list;
    }
    return undefined
  }

  async getShoppingListInfo() : Promise<List | undefined> {
    const currentUserID = await this.accountService.getCurrentUserID();
    if (currentUserID) {
      // get all gifts from shopping-list
      const shoppingQuerySnapshot = await getDocs(query(collection(this.db, 'lists', currentUserID, 'shopping-list'), orderBy('user')));
      // convert DocumentData to List
      let list: List = {
        type: 'shopping',
        owner: await this.accountService.getUserInfo(currentUserID),
        giftsByUser: shoppingQuerySnapshot.docs.length > 0 ? {} : undefined,
      };

      for (let i = 0; i < shoppingQuerySnapshot.docs.length; i++) {
        const gift = shoppingQuerySnapshot.docs[i].data() as Gift;
        console.log('gift', gift, typeof gift)
        const userID = gift.isWishedByID;
        if (!list.giftsByUser![userID] && gift.isWishedByUser) { // if first gift in array wished by a user
          list.giftsByUser![userID] = {
            user: gift.isWishedByUser, // add user info to List
            gifts: {},
          }
        }
        console.log(list)
        list.giftsByUser![userID].gifts[gift.id] = gift;
        return list;
      }
    }
    return undefined
  }

  async addGiftToWishList(gift: NewGift) {
    const currentUserID = await this.accountService.getCurrentUserID();
    if (currentUserID) {
      await runTransaction(this.db, async (transaction) => {
        // update db.gifts
        const giftRef = doc(collection(this.db, 'gifts'))
        transaction.set(giftRef, {
          name: gift.name,
          url: gift.url,
          details: gift.details,
          isWishedBy: currentUserID,
        });

        // update current user's wish-list
        const wishRef = doc(this.db, 'lists', currentUserID, 'wish-list', giftRef.id)
        transaction.set(wishRef, {
          id: giftRef.id,
          name: gift.name,
          url: gift.url,
          details: gift.details,
          isWishedBy: currentUserID,
        });
      })
    }
  }

  /**
  * Claims a gift for the current user.
  *
  * @param gift - A Gift object containing the data for the gift being claimed.
  */
  async addGiftToShoppingList(gift: Gift) {
    if (gift.status === 'claimed') {
      console.error('Gift already claimed')
    } else {
      const currentUserID = await this.accountService.getCurrentUserID();
      if (currentUserID) {
        await runTransaction(this.db, async (transaction) => {
          // update db.gifts
          const giftRef = doc(this.db, 'gifts', gift.id)
          transaction.update(giftRef, {
            isClaimedBy: currentUserID,
            status: 'claimed',
          });

          // update current user's shopping-list
          const shoppingRef = doc(this.db, 'lists', currentUserID, 'shopping-list', gift.id);
          transaction.set(shoppingRef, {
            ...gift,
            isWishedBy: await this.accountService.getUserInfo(currentUserID),
            status: 'claimed',
          });
          
          // update isWishedBy user's wish-list
          const wishedByID = typeof gift.isWishedByID;
          const wishRef = doc(this.db, 'lists', wishedByID, 'wish-list', gift.id);
          transaction.update(wishRef, {
            status: 'claimed',
          });
        });
      } 
    }
  }
}
