import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { FirebaseService } from './firebase.service';
import { collection, collectionGroup, doc, getDoc, getDocs, orderBy, query, runTransaction, where } from 'firebase/firestore';
import { Group, NewGroup, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  db = this.firebaseService.db;
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) { }

  async getAllGroupsForUser(userID: string): Promise<Group[]> {
    const q = query(
      collectionGroup(this.db, 'members'),
      where('id', '==', userID)
    );

    const snapshot = await getDocs(q);
    let groups: Group[] = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      groups.push({
        id: doc.ref.parent.parent!.id,
        name: data['groupName'],
        description: data['description'],
      })
    });
    return groups;
  }

  async getGroupInfo(groupID: string) {
    const groupSnapshot = await getDoc(doc(this.db, 'groups', groupID));
  }

  /**
  * Gets the members of the group with the given groupID.
  * @param groupID - The ID of the group whose members to return.
  * @returns A promise that resolves to an array of User objects.
  */
  async getGroupMembers(groupID: string): Promise<User[]> {
    const membersQ = query(collection(this.db, 'groups', groupID, 'members'), where('status', '==', 'accepted'), orderBy('displayName'));
    const members =  await getDocs(membersQ)
    return members.docs.map(doc => doc.data()) as User[];
  }

  /**
  * Adds a new group.
  * @param newGroup - A NewGroup object containing the data for the group being added.
  * @returns A promise that resolves to the ID of the newly created list, or null if the creation failed.
  */
  async addGroup(newGroup: NewGroup): Promise<string | undefined> {
    return await runTransaction(this.db, async (transaction) => {
      if (this.accountService.currentUserID) {
        const newListRef = doc(collection(this.db, 'groups'));
        transaction.set(newListRef, {
          ...newGroup,
          id: newListRef.id,
        });
        const newListMembersRef = doc(this.db, 'groups', newListRef.id, 'members', this.accountService.currentUserID);
        const currentUser = this.accountService.currentUser;
        transaction.set(newListMembersRef, {
          ...currentUser,
          groupName: newGroup.name,
        });
        return newListRef.id;
      }
      return undefined;
    })
  }

  async updateGroup(oldGroup: Group, newGroup: NewGroup) {
      await runTransaction(this.db, async (transaction) => { 
      const listRef = doc(this.db, 'lists', this.accountService.currentUserID!, 'wish-lists', oldGroup.id);
      transaction.update(listRef, {...oldGroup, ...newGroup});
    });
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
