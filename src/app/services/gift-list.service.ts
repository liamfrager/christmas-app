import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';

type Gift = {
  name: string,
  url: string,
  details: string,
};

@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  async getListInfo(uid: string) {
    let gifts: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'lists', uid, 'wish-list'));
    querySnapshot.forEach((doc) => {
      gifts.push(doc.data());
    });
    return gifts;
  }

  async getShoppingListInfo() {
    let shoppingListInfo: any[] = [];

    const currentUserUID = await this.accountService.getCurrentUserUID();
    const querySnapshot = await getDocs(query(collection(this.db, 'lists', currentUserUID!, 'shopping-list'), orderBy('user')));
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      const refData = querySnapshot.docs[i].data();
      shoppingListInfo.push(refData);
    }
    return shoppingListInfo;
  }

  async addGiftToList(uid: string, gift: Gift) {
    const docRef = await addDoc(collection(this.firebaseService.db, 'lists', uid, 'wish-list'), {
      name: gift.name,
      url: gift.url,
      details: gift.details
    });
    updateDoc(docRef, {
      id: docRef.id
    })
  }

  async addGiftToShoppingList(uid: string, giftID: string) {
    // Add gift to shopping list (reference to gift?);
    const currentUserUID = await this.accountService.getCurrentUserUID();
    const shoppingDocRef = doc(this.firebaseService.db, 'lists', currentUserUID!, 'shopping-list', giftID);
    const wishDocRef = doc(this.firebaseService.db, 'lists', uid, 'wish-list', giftID);

    const wishGift = (await getDoc(wishDocRef)).data();
    const isAlreadyClaimed = wishGift?.['isClaimed'] ? true : false;
    if (!isAlreadyClaimed) {
      setDoc(shoppingDocRef, {
        id: giftID,
        user: uid,
        status: 'claimed'
      });
      // Update gift to indicate that it has been claimed.
      updateDoc(wishDocRef, {
        isClaimed: true
      })
    } else {
      console.log('Gift already claimed!');
    }
  } 
}
