import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { AccountService } from './account.service';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DatabaseMigrationService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {}
  db = this.firebaseService.db;

  async migrateWishLists() {
    try {
      // Loop through each user
      const allUsers = ['4s4B1axxXEQteVDp5DtuOq72pK42', 'EQXtBFdyjehT81WTjwxigB30zC52', 'Geim2QD1v6Nm413ICCUpApZFO6z1', 'PEix0xEDyZVwMW4wMfxY83Qbaij2', 'VgLKDGuMzuXi5F0nccEq5Gnlp9l1', 'osUu9SKamWUJK7jM8REk9BZKRTK2', 'ujtlFX3zwPOZHQM15jon9eAqPu43', 'xcLuPEudGKThyy4MKKFYCG2wQrm1', 'zncVQJy3qbUqHdRI6GyJsUrFhV72'];
      allUsers.forEach(async id => {
        const user: User = await this.accountService.getUserInfo(id) as User;
        console.log(`Migrating user with id ${id}: `, user);
        try {
          // Reference the old "wish-list" collection
          const oldWishList = await getDocs(collection(this.db, 'lists', user.id, 'wish-list'));
          const newWishListRef = doc(collection(this.db, 'lists', user.id, 'wish-lists'));
          console.log(`Created new list with id: ${newWishListRef.id}`);
          await setDoc(newWishListRef, {
            id: newWishListRef.id,
            type: 'wish',
            name: 'Wish List',
            owner: user,
          })
          // Loop through each gift document in the old collection
          const giftPromises = oldWishList.docs.map(async (gift) => {
            const giftID = gift.id;
            const giftData = gift.data();

            // Write data to the new structure
            try {
              const newGiftRef = doc(this.db, 'lists', user.id, 'wish-lists', newWishListRef.id, 'gifts', giftID);
              await setDoc(newGiftRef, giftData);
              console.log(`Migrated gift ${giftID} to lists/${user.id}/wish-lists/${newWishListRef.id}/gifts/`);
            } catch (error) {
              console.error(`Error migrating gift: ${giftID}`, error);
            }
          });
          await Promise.all(giftPromises);
          console.log(`Migrated all gifts for user: ${user.id}`)
        } catch (error) {
          console.error(`Error migrating wish-list for user: ${user.id}`, error);
        }
      });
      console.log('Migration completed successfully.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }
}