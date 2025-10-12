import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { GiftExchangeMap, GiftExchangeRestrictions, Group, Member } from '../types';
import { collection, doc, runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GiftExchangeService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  async createGiftExchange(group: Group): Promise<Group> {
    const IDMap = this.generateGiftIDMap(group.giftExchangeRestrictions!);
    if (IDMap === null) return group;
    group.giftExchangeMap = Object.fromEntries(Object.entries(IDMap).map(([k, v]) => [k, group.members?.find(m => m.id === v)!]));
    await runTransaction(this.db, async (transaction) => {
      const groupRef = doc(this.db, "groups", group.id);
      transaction.update(groupRef, {
        giftExchangeMap: group.giftExchangeMap,
      });
    })
    return group;
  }

  generateGiftIDMap(restrictions: GiftExchangeRestrictions): Record<string, string> | null {
    const givers = this.shuffle(Object.keys(restrictions));
    const result: Record<string, string> = {};
    const assigned = new Set<string>();

    const backtrack = (index: number): boolean => {
      if (index === givers.length) return true;

      const giver = givers[index];
      const candidates = Object.entries(restrictions[giver])
        .filter(([r, allowed]) => allowed && r !== giver && !assigned.has(r))
        .map(([r]) => r);

      for (const receiver of this.shuffle(candidates)) {
        result[giver] = receiver;
        assigned.add(receiver);

        if (backtrack(index + 1)) return true;

        delete result[giver];
        assigned.delete(receiver);
      }

      return false;
    };

    return backtrack(0) ? result : null;
  }

  /**
   * Validates a set of gift exchange restrictions by checking the following:
   * - Givers with no valid recipients.
   * - Recipients with no valid givers.
   * - Global restrictions that prevent forming a valid mapping.
   */
  validateRestrictions(restrictions: GiftExchangeRestrictions, members: Member[]): string[] {
    const errors: string[] = [];

    // Build the full set of userIds appearing either as a giver (top-level keys)
    // or as receivers (inner keys), so we catch missing receiver entries.
    const giverIds = Object.keys(restrictions);
    const receiverIdSet = new Set<string>();
    for (const g of giverIds) {
      const row = restrictions[g] || {};
      Object.keys(row).forEach(r => receiverIdSet.add(r));
    }
    // Union of givers and receivers
    const allUserIds = Array.from(new Set([...giverIds, ...Array.from(receiverIdSet)]));

    // Each giver must have at least one allowed recipient.
    for (const g of allUserIds) {
      const allowed = allUserIds.filter(r => r !== g && !!restrictions[g][r]);
      if (allowed.length === 0) {
        errors.push(`'${members.find(m => m.id === g)!.displayName}' cannot be assigned to anyone.`);
      }
    }

    // Each recipient must have at least one giver who can give to them.
    for (const r of allUserIds) {
      const possibleGivers = allUserIds.filter(g => g !== r && !!restrictions[g][r]);
      if (possibleGivers.length === 0) {
        errors.push(`Nobody can be assigned to '${members.find(m => m.id === r)!.displayName}'.`);
      }
    }

    // Check globally to see if a valid mapping can be made.
    if (errors.length === 0 && this.generateGiftIDMap(restrictions) === null) {
      errors.push("Uh oh! The given restrictions cannot form a valid assignment. Please update the restrictions and try again.");
    }

    return errors;
  }
}
