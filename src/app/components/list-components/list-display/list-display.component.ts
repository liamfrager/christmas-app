import { Component, Input, OnChanges } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { DocumentData, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';
import { FirebaseService } from '../../../services/firebase.service';
import { Gift, Gifts, List, User } from '../../../types';

@Component({
    selector: 'app-list-display',
    standalone: true,
    templateUrl: './list-display.component.html',
    styleUrl: './list-display.component.css',
    imports: [GiftDisplayComponent, GiftDetailsModalComponent, CommonModule]
})
export class ListDisplayComponent implements OnChanges {
  constructor(private giftListService: GiftListService, private accountService: AccountService, private firebaseService: FirebaseService) {};
  @Input({ required: true }) listType!: string;
  @Input() uid!: string;
  
  listOwner?: User;
  isOwnedByCurrentUser = true;
  noGiftsMessage: string = 
    this.isOwnedByCurrentUser ?
    `You have no gifts in your ${this.listType} list` :
    `${this.listOwner?.['displayName']} has no gifts in their ${this.listType} list`
  listInfo: List | undefined;
  
  async ngOnChanges() {
    if (this.listType === "wish") {
      this.listInfo = await this.giftListService.getWishListInfo(this.uid) as List;
      this.listOwner = await this.accountService.getUserInfo(this.uid);
      const currentUserUID = await this.accountService.getCurrentUserUID();
      this.isOwnedByCurrentUser = this.listOwner?.['uid'] === currentUserUID;
    } else if (this.listType === "shopping") {
      this.listInfo = await this.getShoppingListGifts();
    } else {
      console.log(`${this.listType} is not a valid list type.`)
    }
  }

  async getShoppingListGifts() {
    const shoppingListInfo = await this.giftListService.getShoppingListInfo();
    if (shoppingListInfo) {
      var result: List = {};
      for (let i = 0; i < shoppingListInfo.length; i++) {
        const gift = shoppingListInfo[i];
        const userID = gift.isWishedBy;
        if (!result[userID]) {
          result[userID].user = await this.accountService.getUserInfo(userID)
        }
        result[userID].gifts[gift.id] = gift;
      }
      return result;
    } else {
      return {};
    }
  }

  giftInModal!: Gift;
  showModal: boolean = false;
  showInModal(gift: Gift) {
    this.giftInModal = gift;
    this.showModal = true;
  }

  claimGift() {
    this.giftListService.addGiftToShoppingList(this.uid, this.giftInModal!);
  }

  async setStatus(status: string) {
    console.log('status: ', status)
    try {
      const currentUserUID = await this.accountService.getCurrentUserUID();
      const res = updateDoc(doc(this.firebaseService.db, 'lists', currentUserUID!, 'shopping-list', this.giftInModal.id), {
        status: status
      })
      this.giftInModal = {...this.giftInModal, status: status}
      // TODO: update this.gifts to have the correct status.
      // - refactor this.gifts to be an object with uids as keys.
      // - refactor this.gifts.['user'].gifts to be an object with giftIDs as keys.
      // - refactor gift in database to hold 'userRequestingGift' info.
      // - this.gifts[this.giftInModal.userRequestingGift].gifts[this.giftInModal.id].status = status
    } catch(e) { console.log(e) }
  }

  getIsChecked(gift: any): boolean {
    var result: boolean = false;
    if (this.listType === 'wish') {
      if (!this.isOwnedByCurrentUser && gift.isClaimedBy) {
        result = true;
      }
    } else if (this.listType === 'shopping') {
        this.giftListService.getShoppingListInfo
      if (true) {
      }
    }
    return result
  }

}
