import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { FirebaseService } from './firebase.service';
import { collection, doc, runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SecretSantaServiceService {
  db = this.firebaseService.db;
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) { }

  async createSecretSanta(giftingMap: Map<string, string>, year: number) {
    const currentUserID = this.accountService.currentUser.id;
    if(currentUserID) {
      await runTransaction(this.db, async (transaction) => {
        const groupRef = doc(collection(this.db, "groups"));
        transaction.set(groupRef, {
          members: Array.from(giftingMap.keys()),
          giftingMap: Object.fromEntries(giftingMap.entries()),
          year,
        })

        for(const id of giftingMap.keys()) {
          const userRef = doc(this.db, "users", id);
          transaction.update(userRef, {
            groups: [{id: groupRef.id, status: "invited"}]
          })
        }
      })
    }
  }
}
