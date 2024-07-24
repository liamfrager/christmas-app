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
  
  ngOnChanges() {
    if (this.list) {
      const currentUserID = this.accountService.currentUser.id;
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
    this.giftInModal = gift;
  }

  hideModal() {
    this.giftInModal = undefined;
  }

  claimGift() {
    this.giftListService.addGiftToShoppingList(this.giftInModal!);
  }

  updateStatus(status: string) {
    try {
      if (this.giftInModal) {
        const currentUserID = this.accountService.currentUser.id;
        const res = updateDoc(doc(this.firebaseService.db, 'lists', currentUserID!, 'shopping-list', this.giftInModal.id), {
          status: status
        })
        this.giftInModal = {...this.giftInModal, status: status}
      } else {
        throw Error('giftInModal does not exist.');
      }
    } catch(e) { console.error(e) }
  }

  deleteGift() {
    const currentUserID = this.accountService.currentUser.id;
    if (currentUserID) {
      this.giftListService.deleteGiftFromWishList(this.giftInModal!);
      delete this.list!.giftsByUser![currentUserID].gifts[this.giftInModal!.id]
      this.hideModal()
    }
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
