import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { FirebaseService } from './firebase.service';
import { collection, collectionGroup, doc, getDoc, getDocs, orderBy, query, runTransaction, where, writeBatch } from 'firebase/firestore';
import { Group, Member, NewGroup, User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  db = this.firebaseService.db;
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) { }

  async getAllGroupsForUser(userID: string): Promise<Group[]> {
    const q = query(
      collectionGroup(this.db, 'members'),
      where('id', '==', userID),
      where('membershipStatus', 'in', ['member', 'admin']),
    );
    const snapshot = await getDocs(q);
    let groups: Group[] = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      groups.push({
        id: doc.ref.parent.parent!.id,
        name: data['groupName'],
        description: '',
        members: [],
      })
    });
    return groups;
  }

  /**
  * Gets the group with the given groupID.
  * @param groupID - The ID of the group to return.
  * @returns A promise that resolves to a Group object.
  */
  async getGroup(groupID: string): Promise<Group> {
    const groupSnap =  await getDoc(doc(this.db, 'groups', groupID));
    let group = groupSnap.data() as Group;
    const membersQ = query(collection(this.db, 'groups', groupID, 'members'), orderBy('displayName'));
    const membersSnap =  await getDocs(membersQ);
    const members = membersSnap.docs.map(doc => doc.data());
    group.members = members as Member[];
    return group;
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
        const currentUser = {
          ...this.accountService.currentUser,
          groupID: newListRef.id,
          groupName: newGroup.name,
          membershipStatus: 'admin',
        }
        transaction.set(newListMembersRef, currentUser);
        return newListRef.id;
      }
      return undefined;
    })
  }

  async updateGroup(oldGroup: Group, newGroup: NewGroup) {
    const batch = writeBatch(this.db);
    const groupRef = doc(this.db, 'groups', oldGroup.id);
    batch.update(groupRef, {...oldGroup, ...newGroup});
    for (let member of oldGroup.members) {
      const memberRef = doc(this.db, 'groups', oldGroup.id, 'members', member.id);
      batch.update(memberRef, { groupName: newGroup.name });
    }
    batch.commit();
  }

  async deleteGroup(group: Group) {
    const currentUserGroupMember = group.members?.find(m => m.id === this.accountService.currentUserID);
    if (currentUserGroupMember && currentUserGroupMember.membershipStatus === 'admin') {
      const batch = writeBatch(this.db);
      const groupRef = doc(this.db, 'groups', group.id);
      batch.delete(groupRef);
      const membersSnap = await getDocs(collection(this.db, 'groups', group.id, 'members'));
      membersSnap.forEach(member => batch.delete(member.ref));
      batch.commit();
    }
  }

  async addGroupMembers(members: Member[], group: Group) {
    const batch = writeBatch(this.db);
    for (const member of members) {
      const groupMembersRef = doc(this.db, 'groups', group.id, 'members', member.id);
      batch.set(groupMembersRef, member);
    }
    await batch.commit();
  }

  async updateGroupMembers(members: Member[], group: Group) {
    const batch = writeBatch(this.db);
    for (const updatedMember of members) {
      const oldMember = group.members.find(m => m.id === updatedMember.id);
      if (oldMember && JSON.stringify(oldMember) === JSON.stringify(updatedMember)) continue;
      const memberRef = doc(this.db, 'groups', group.id, 'members', updatedMember.id);
      batch.update(memberRef, updatedMember);
    }
    await batch.commit();
  }

  async deleteGroupMembers(members: Member[], group: Group) {
    const batch = writeBatch(this.db);
    for (const member of members) {
      const memberRef = doc(this.db, 'groups', group.id, 'members', member.id);
      batch.delete(memberRef);
    }
    await batch.commit();
  }

  /**
   * Fetches the incoming group requests of the current user.
   * @returns A promise that resolves to an array of Group objects.
   */
  async getGroupRequests(): Promise<Member[]> {
    const q = query(
      collectionGroup(this.db, 'members'),
      where('id', '==', this.accountService.currentUserID),
      where('membershipStatus', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data()) as Array<Member>;
  }
}
