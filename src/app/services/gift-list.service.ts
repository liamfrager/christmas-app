import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { Gift, Gifts, List, NewGift, User } from '../types';


@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  async getWishListInfo(uid: string) : Promise<List | undefined> {
    let gifts: Gifts = {};
    const querySnapshot = await getDocs(collection(this.db, 'lists', uid, 'wish-list'));
    querySnapshot.forEach((doc) => {
      gifts[doc.data()['id']] = doc.data() as Gift;
    });
    let user: User = await this.accountService.getUserInfo(uid);
    if (user) {
      let list: List = {
        type: 'wish',
        owner: user,
        giftsByUser: {
          [user.id]: {
            gifts: gifts,
            user: user,
          }
        }
      }
      return list;
    } else {
      return undefined
    }
  }

  async getShoppingListInfo() : Promise<List | undefined> {
    let listOfGifts: Gift[] = [];

    const currentUserID = await this.accountService.getCurrentUserID();
    if (currentUserID) {
      const shoppingQuerySnapshot = await getDocs(query(collection(this.db, 'lists', currentUserID, 'shopping-list'), orderBy('user')));
      for (let i = 0; i < shoppingQuerySnapshot.docs.length; i++) {
        const shoppingRefData = shoppingQuerySnapshot.docs[i].data();
        const wishQuerySnapshot = await getDoc(doc(this.db, 'lists', shoppingRefData['giftWishedBy']!, 'wish-list', shoppingRefData['id']));
        const wishRefData = wishQuerySnapshot.data()
        const gift = {...shoppingRefData, ...wishRefData} as Gift;
        listOfGifts.push(gift);
      }
      if (listOfGifts) {
        let list: List = {
          type: 'shopping',
          owner: await this.accountService.getUserInfo(currentUserID),
          giftsByUser: {}
        };
        for (let i = 0; i < listOfGifts.length; i++) {
          const gift = listOfGifts[i];
          const userID = gift.isWishedBy;
          if (!list.giftsByUser[userID]) {
            list.giftsByUser[userID].user = await this.accountService.getUserInfo(userID)
          }
          list.giftsByUser[userID].gifts[gift.id] = gift;
        }
        return list;
      }
    }
    return undefined
  }

  async addGiftToWishList(gift: NewGift) {
    const currentUserID = await this.accountService.getCurrentUserID();
    if (currentUserID) {
      // update db.gifts
      const giftRef = await addDoc(collection(this.firebaseService.db, 'gifts'), {
        name: gift.name,
        url: gift.url,
        details: gift.details,
        isWishedBy: currentUserID,
      });

      // update current user's wish-list
      const wishRef = await updateDoc(doc(this.firebaseService.db, 'lists', currentUserID, 'wish-list', giftRef.id), {
        id: giftRef.id,
        name: gift.name,
        url: gift.url,
        details: gift.details,
        isWishedBy: currentUserID,
      });
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
        // update db.gifts
        const giftRef = doc(this.firebaseService.db, 'gifts', gift.id)
        updateDoc(giftRef, {
          isClaimedBy: currentUserID,
          status: 'claimed',
        })

        // update current user's shopping-list
        const shoppingRef = doc(this.firebaseService.db, 'lists', currentUserID, 'shopping-list', gift.id);
        setDoc(shoppingRef, {
          ...gift,
          status: 'claimed',
        });

        // update isWishedBy user's wish-list
        const wishRef = doc(this.firebaseService.db, 'lists', gift.isWishedBy, 'wish-list', gift.id);
        updateDoc(wishRef, {
          status: 'claimed',
        })
      } 
    }
  }
}
