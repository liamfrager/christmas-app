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
  @Input({ required: true }) list?: List;
  
  isOwnedByCurrentUser = true;
  noGiftsMessage: string = 
    this.list ?
    this.isOwnedByCurrentUser ?
    `You have no gifts in your ${this.list.type} list` :
    `${this.list.owner.displayName} has no gifts in their ${this.list.type} list` :
    'Could not load gifts';
  
  async ngOnChanges() {
    if (this.list) {
      console.log('List exists!')
      const currentUserID = await this.accountService.getCurrentUserID();
      this.isOwnedByCurrentUser = this.list.owner.id === currentUserID;
    }
    this.noGiftsMessage = 
      this.list ?
      this.isOwnedByCurrentUser ?
      `You have no gifts in your ${this.list.type} list.` :
      `${this.list.owner.displayName} has no gifts in their ${this.list.type} list.` :
      'Could not load gifts.';
  }


  giftInModal?: Gift;
  showInModal(gift: Gift) {
    console.log('showInModal()')
    this.giftInModal = gift;
  }

  hideModal() {
    this.giftInModal = undefined;
  }

  claimGift() {
    this.giftListService.addGiftToShoppingList(this.giftInModal!);
  }

  async updateStatus(status: string) {
    try {
      if (this.giftInModal) {
        const currentUserID = await this.accountService.getCurrentUserID();
        const res = updateDoc(doc(this.firebaseService.db, 'lists', currentUserID!, 'shopping-list', this.giftInModal.id), {
          status: status
        })
        this.giftInModal = {...this.giftInModal, status: status}
      } else {
        throw Error('giftInModal does not exist.');
      }
      // TODO: update this.gifts to have the correct status.
      // - refactor this.gifts to be an object with uids as keys.
      // - refactor this.gifts.['user'].gifts to be an object with giftIDs as keys.
      // - refactor gift in database to hold 'userRequestingGift' info.
      // - this.gifts[this.giftInModal.userRequestingGift].gifts[this.giftInModal.id].status = status
    } catch(e) { console.log(e) }
  }

  deleteGift() {
    this.giftListService.deleteGiftFromWishList(this.giftInModal!);
  }

  getIsChecked(gift: any): boolean {
    var result: boolean = false;
    if (this.list!.type === 'wish') {
      if (!this.isOwnedByCurrentUser && gift.isClaimedBy) {
        result = true;
      }
    } else if (this.list!.type === 'shopping') {
        this.giftListService.getShoppingListInfo
      if (true) {
      }
    }
    return result
  }

}
