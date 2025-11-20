import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { collection, collectionGroup, doc, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { AccountService } from './account.service';
import { Gift, User } from '../types';

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

  async addIsWishedOnListIDToGifts() {
    try {
      // Loop through each user
      const allUsers = ['4s4B1axxXEQteVDp5DtuOq72pK42', 'EQXtBFdyjehT81WTjwxigB30zC52', 'Geim2QD1v6Nm413ICCUpApZFO6z1', 'PEix0xEDyZVwMW4wMfxY83Qbaij2', 'VgLKDGuMzuXi5F0nccEq5Gnlp9l1', 'osUu9SKamWUJK7jM8REk9BZKRTK2', 'ujtlFX3zwPOZHQM15jon9eAqPu43', 'xcLuPEudGKThyy4MKKFYCG2wQrm1', 'zncVQJy3qbUqHdRI6GyJsUrFhV72'];
      for (const id of allUsers) {
        const user: User = await this.accountService.getUserInfo(id) as User;
        console.log(`updating gifts for user with id ${id}: `, user);
        try {
          // Reference the old "wish-list" collection
          const listsSnap = await getDocs(collection(this.db, 'lists', user.id, 'wish-lists'));
          const lists = listsSnap.docs;
          for (const list of lists) {
            const wishList = await getDocs(collection(this.db, 'lists', user.id, 'wish-lists', list.id, 'gifts'));
            const giftPromises = wishList.docs.map(async (gift) => {
              try {
                await updateDoc(gift.ref, {isWishedOnListID: list.id});
                console.log(`Added isWishedOnListID ${list.id} for gift with id ${gift.id}`);
              } catch (error) {
                console.error(`Error migrating gift: ${gift.id}`, error);
              }
            });
            await Promise.all(giftPromises);
            console.log(`Migrated all gifts for list: ${list.id}`)
          }
          const shoppingList = await getDocs(collection(this.db, 'lists', user.id, 'shopping-list'));
          const shoppingPromises = shoppingList.docs.map(async (gift) => {
            const listID = gift.data()['isWishedByID'];
            try {
              await updateDoc(gift.ref, {isWishedOnListID: listID});
              console.log(`Added isWishedOnListID ${listID} for gift with id ${gift.id}`);
            } catch (error) {
              console.error(`Error migrating gift: ${gift.id}`, error);
            }
          });
          await Promise.all(shoppingPromises);
          console.log(`Migrated all gifts for user: ${user.id}`)
        } catch (error) {
          console.error(`Error migrating wish-list for user: ${user.id}`, error);
        }
      }
      console.log('Migration completed successfully.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }

  async addIDToGifts() {
    try {
      // Loop through each user
      const allUsers = ['4s4B1axxXEQteVDp5DtuOq72pK42', 'EQXtBFdyjehT81WTjwxigB30zC52', 'Geim2QD1v6Nm413ICCUpApZFO6z1', 'PEix0xEDyZVwMW4wMfxY83Qbaij2', 'VgLKDGuMzuXi5F0nccEq5Gnlp9l1', 'osUu9SKamWUJK7jM8REk9BZKRTK2', 'ujtlFX3zwPOZHQM15jon9eAqPu43', 'xcLuPEudGKThyy4MKKFYCG2wQrm1', 'zncVQJy3qbUqHdRI6GyJsUrFhV72'];
      for (const id of allUsers) {
        const user: User = await this.accountService.getUserInfo(id) as User;
        console.log(`updating gifts for user with id ${id}: `, user);
        try {
          // Reference the old "wish-list" collection
          const listsSnap = await getDocs(collection(this.db, 'lists', user.id, 'wish-lists'));
          const lists = listsSnap.docs;
          for (const list of lists) {
            const wishList = await getDocs(collection(this.db, 'lists', user.id, 'wish-lists', list.id, 'gifts'));
            const giftPromises = wishList.docs.map(async (gift) => {
              try {
                await updateDoc(gift.ref, {id: gift.id});
                console.log(`Added ID to gift: ${gift.id}`);
              } catch (error) {
                console.error(`Error migrating gift: ${gift.id}`, error);
              }
            });
            await Promise.all(giftPromises);
            console.log(`Migrated all gifts for list: ${list.id}`)
          }
          const shoppingList = await getDocs(collection(this.db, 'lists', user.id, 'shopping-list'));
          const shoppingPromises = shoppingList.docs.map(async (gift) => {
            try {
              await updateDoc(gift.ref, {id: gift.id});
              console.log(`Added ID to gift: ${gift.id}`);
            } catch (error) {
              console.error(`Error migrating gift: ${gift.id}`, error);
            }
          });
          await Promise.all(shoppingPromises);
          console.log(`Migrated all gifts for user: ${user.id}`)
        } catch (error) {
          console.error(`Error migrating wish-list for user: ${user.id}`, error);
        }
      }
      console.log('Migration completed successfully.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }

  async addIsArchivedToShoppingLists() {
    const shoppingSnapshot = await getDocs(collectionGroup(this.db, 'shopping-list'));

    const updates: { ref: any; data: any }[] = [];

    shoppingSnapshot.forEach(giftDoc => {
      const data = giftDoc.data() as Gift;

      if (data.isArchived === undefined) {
        updates.push({
          ref: giftDoc.ref,
          data: { isArchived: false }
        });
      }
    });

    const chunkSize = 400;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const batch = writeBatch(this.db);
      const chunk = updates.slice(i, i + chunkSize);
      chunk.forEach(u => batch.update(u.ref, u.data));
      await batch.commit();
    }

    console.log(`Updated ${updates.length} shopping-list gifts.`);
  }
}