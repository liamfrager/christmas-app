import { Component, Input, OnChanges } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { DocumentData, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';
import { FirebaseService } from '../../../services/firebase.service';
import { Gift, Gifts, List, User } from '../../../types';
import { UserDisplayComponent } from '../../user-display/user-display.component';

@Component({
    selector: 'app-list-display',
    standalone: true,
    templateUrl: './list-display.component.html',
    styleUrl: './list-display.component.css',
    imports: [GiftDisplayComponent, GiftDetailsModalComponent, CommonModule, UserDisplayComponent]
})
export class ListDisplayComponent implements OnChanges {
  constructor(private giftListService: GiftListService, private accountService: AccountService, private firebaseService: FirebaseService) {};
  @Input({ required: true }) list?: List;
  
  isOwnedByCurrentUser: boolean = true;
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
  isModalOpen: boolean = false;

  /**
   * Displays data for a given gift in `app-gift-details-modal`.
   * @param gift - The gift to be shown in the modal.
   */
  showInModal(gift: Gift) {
    this.isModalOpen = true;
    this.giftInModal = gift;
  }

  /**
   * Closes `app-gift-details-modal`.
   */
  hideModal() {
    this.isModalOpen = false;
    setTimeout(() => {
      this.giftInModal = undefined;
    }, 700); // Wait for the animation to complete (0.7s)
  }

  /**
   * Claims the current gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is unclaimed.
   */
  claimGift() {
    this.giftListService.addGiftToShoppingList(this.giftInModal!);
  }

  /**
   * Updates the status of the current gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is claimed by the current user.
   * @param status - The gift's new status.
   */
  updateStatus(status: 'claimed' | 'bought' | 'ordered' | 'wrapped' | 'under tree' | 'deleted') {
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

  /**
   * Deletes the current gift displayed in `app-gift-details-modal`
   * Should only be called when gift is owned by the current user.
   */
  deleteGift() {
    const currentUserID = this.accountService.currentUser.id;
    if (currentUserID) {
      this.giftListService.deleteGiftFromWishList(this.giftInModal!);
      this.list!.giftsByUser![currentUserID].gifts.delete(this.giftInModal!.id)
      this.hideModal()
    }
  }

  /**
   * Determines whether the checkbox next to a gift should be checked off.
   * @param gift - The gift being checked.
   */
  getIsChecked(gift: Gift): boolean {
    var result: boolean = false;
    if (this.list!.type === 'wish') {
      if (!this.isOwnedByCurrentUser && gift.isClaimedByUser) {
        result = true;
      }
    } else if (this.list!.type === 'shopping') {
    }
    return result
  }

}
