import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { FirebaseService } from './firebase.service';
import { collection, doc, getDoc, runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SecretSantaServiceService {
  db = this.firebaseService.db;
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) { }

  async getGroupInfo(groupID: string) {
    //const currentUserID = this.accountService.currentUser.id;
    const groupSnapshot = await getDoc(doc(this.db, 'groups', groupID));
    console.log(groupSnapshot)
    console.log(groupSnapshot.data())
  }

  async createSecretSanta(giftingMap: Map<string, string>, year: number, name: string) {
    const currentUserID = this.accountService.currentUserID;
    if(currentUserID) {
      await runTransaction(this.db, async (transaction) => {
        const groupRef = doc(collection(this.db, "groups"));
        transaction.set(groupRef, {
          name,
          members: Array.from(giftingMap.keys()),
          giftingMap: Object.fromEntries(giftingMap.entries()),
          year,
        })

        Array.from(giftingMap.keys()).forEach(async id => {
          const userRef = doc(this.db, "users", id);
          const userSnapshot = await transaction.get(userRef);
          let groupArray = userSnapshot.get('groups');
          if(groupArray === undefined) {
            groupArray = [groupRef.id];
          } else {
            groupArray.push(groupRef.id);
          }
          transaction.update(userRef, 'groups', groupArray);
        })
      })
    }
  }
}
