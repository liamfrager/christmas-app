import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AccountService } from './account.service';
import { Group } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GiftExchangeService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;

  createGiftExchange(group: Group): Group {
    group.giftExchangeMap = new Map();
    group.giftExchangeMap.set(this.accountService.currentUserID!, this.accountService.currentUser);
    return group;
  }
}
