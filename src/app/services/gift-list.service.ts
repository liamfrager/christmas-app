import { Injectable } from '@angular/core';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

type Gift = {
  name: string,
  url: string,
  details: string,
};

@Injectable({
  providedIn: 'root'
})
export class GiftListService {
  constructor(private firebaseService: FirebaseService) {};
  db = this.firebaseService.db;

  async getListInfo(uid: string) {
    let gifts: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'lists', uid, 'wish-list'));
    querySnapshot.forEach((doc) => {
      gifts.push(doc.data());
    });
    return gifts;
  }

  addGiftToList(uid: string, gift: Gift) {
    const docRef = doc(this.firebaseService.db, 'lists', uid, 'wish-list', gift.name)
    setDoc(docRef, {
      name: gift.name,
      url: gift.url,
      details: gift.details
    });
  }

}
