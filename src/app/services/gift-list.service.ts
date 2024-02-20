import { Injectable } from '@angular/core';
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
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
    let shoppingListInfo: {
      user?: DocumentData,
      gifts?: (DocumentData | undefined)[]
    }[] = [];

    const currentUserUID = await this.accountService.getCurrentUserUID();
    const querySnapshot = await getDocs(collection(this.db, 'lists', currentUserUID!, 'shopping-list'));
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      const ref = querySnapshot.docs[i];
      // Fetch data for user.
      const data = ref.data();
      const user = data['user']
      const userInfo = await this.accountService.getUserInfo(data['user']);
      // Fetch data for gifts.
      const giftRefs = data['gifts'];
      const gifts: (DocumentData | undefined)[] = [];
      giftRefs.forEach(async (ref: string) => {
        const giftData = await getDoc(doc(this.db, 'lists', user, 'wish-list', ref));
        gifts.push(giftData.data())
      })
      shoppingListInfo.push({
        user: userInfo,
        gifts: gifts
      })
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
    // TO DO:
    // - add gift to shopping list (reference to gift?);
    // - update gift to indicate that it has been claimed (should it say who it has been claimed by?)
    const currentUserUID = await this.accountService.getCurrentUserUID();
    const docRef = doc(this.firebaseService.db, 'lists', currentUserUID!, 'shopping-list', uid);
    const data = (await getDoc(docRef)).data()!;
    const gifts = data ? [...data['gifts'], giftID] : [giftID];
    setDoc(docRef, {
      user: uid,
      gifts: gifts
    });
  }

}
