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
        gifts: {
          [user.uid]: {
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

    const currentUserUID = await this.accountService.getCurrentUserUID();
    const shoppingQuerySnapshot = await getDocs(query(collection(this.db, 'lists', currentUserUID!, 'shopping-list'), orderBy('user')));
    for (let i = 0; i < shoppingQuerySnapshot.docs.length; i++) {
      const shoppingRefData = shoppingQuerySnapshot.docs[i].data();
      const wishQuerySnapshot = await getDoc(doc(this.db, 'lists', shoppingRefData['giftWishedBy']!, 'wish-list', shoppingRefData['id']));
      const wishRefData = wishQuerySnapshot.data()
      listOfGifts.push({...shoppingRefData, ...wishRefData} as Gift);
    }
    if (listOfGifts) {
      let list: List = {
        type: 'shopping',
        owner: await this.accountService.getUserInfo(currentUserUID!),
        gifts: {}
      };
      for (let i = 0; i < listOfGifts.length; i++) {
        const gift = listOfGifts[i];
        const userID = gift.isWishedBy;
        if (!list.gifts[userID]) {
          list.gifts[userID].user = await this.accountService.getUserInfo(userID)
        }
        list.gifts[userID].gifts[gift.id] = gift;
      }
      return list;
    } else {
      return undefined;
    }
  }

  async addGiftToWishList(uid: string, gift: NewGift) {
    const docRef = await addDoc(collection(this.firebaseService.db, 'lists', uid, 'wish-list'), {
      name: gift.name,
      url: gift.url,
      details: gift.details
    });
    updateDoc(docRef, {
      id: docRef.id
    })
  }

  async addGiftToShoppingList(uid: string, gift: Gift) {
    // Add gift to shopping list (reference to gift?);
    const currentUserUID = await this.accountService.getCurrentUserUID();
    const shoppingDocRef = doc(this.firebaseService.db, 'lists', currentUserUID!, 'shopping-list', gift.id);
    const wishDocRef = doc(this.firebaseService.db, 'lists', uid, 'wish-list', gift.id);

    const wishGift = (await getDoc(wishDocRef)).data();
    const isAlreadyClaimed = wishGift?.['isClaimedBy'] ? true : false;
    if (!isAlreadyClaimed) {
      setDoc(shoppingDocRef, {
        ...gift,
        status: 'claimed'
      });
      // Update gift to indicate that it has been claimed.
      updateDoc(wishDocRef, {
        isClaimedBy: uid
      })
    } else {
      console.log('Gift already claimed!');
    }
  } 
}
