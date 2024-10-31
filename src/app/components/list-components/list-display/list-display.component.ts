import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { doc, updateDoc } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';
import { FirebaseService } from '../../../services/firebase.service';
import { Gift, List, NewGift } from '../../../types';
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
  @Output() onGiftInModal = new EventEmitter();
  
  get isOwnedByCurrentUser(): boolean { return this.list?.owner.id === this.accountService.currentUserID };
  noGiftsMessage: string = 
    this.list ?
    this.isOwnedByCurrentUser ?
    `You have no gifts in your ${this.list.type} list` :
    `${this.list.owner.displayName} has no gifts in their ${this.list.type} list` :
    'Could not load gifts';
  giftInModal?: Gift;
  isModalOpen: boolean = false;
  modalButtonType: 'claim' | 'unclaim' | 'claimed' | 'edit' = 'claimed';
  
  ngOnChanges() {
    this.noGiftsMessage = 
      this.list ?
      this.isOwnedByCurrentUser ?
      `You have no gifts in your ${this.list.type} list.` :
      `${this.list.owner.displayName} has no gifts in their ${this.list.type} list.` :
      'Could not load gifts.';
  }

  /**
   * Displays data for a given gift in `app-gift-details-modal`.
   * @param gift - The gift to be shown in the modal.
   */
  showInModal(gift: Gift) {
    this.isModalOpen = true;
    this.giftInModal = gift;
    this.onGiftInModal.emit(true);
    // update modalButtonText
    this.modalButtonType = (() => {
      if (this.list?.type === 'wish') {
        if (this.isOwnedByCurrentUser) return 'edit';
        if (!gift.isClaimedByID) return 'claim';
        if (gift.isClaimedByID === this.accountService.currentUserID) return 'unclaim';
        return 'claimed';
      } else if (this.list?.type === 'shopping') {
        if (gift.isCustom) return 'edit';
        return 'unclaim';
      }
      return 'claimed';
    })() // execute above function
  }

  /**
   * Closes `app-gift-details-modal`.
   */
  hideModal() {
    this.isModalOpen = false;
    this.onGiftInModal.emit(false);
  }

  /**
   * Handles when the button in `app-gift-details-modal` is clicked.
   */
  onModalButtonClick(event: any) {
    switch (event) {
      case 'delete':
        this.deleteGift();
        break;
      case 'claim':
        this.claimGift();
        break;
      case 'unclaim':
        this.unclaimGift();
        break;
      default:
        this.editGift(event);
        break;
    }
  }

  /**
   * Opens a form to edit gift details for the gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is owned by the current user.
   */
  editGift(newGift: NewGift) {
    if (this.giftInModal!.isWishedByID !== newGift.isWishedByID) {
      if (this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.size === 1) {
        delete this.list!.giftsByUser![this.giftInModal!.isWishedByID];
      } else {
        this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.delete(this.giftInModal!.id);
      }
    }
    this.giftInModal = {...this.giftInModal!, ...newGift};
    if (!this.list!.giftsByUser![this.giftInModal!.isWishedByID]) {
      this.list!.giftsByUser![this.giftInModal!.isWishedByID] = {
        gifts: new Map<string, Gift>(),
        user: this.giftInModal!.isWishedByUser,
      };
    }
    this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.set(this.giftInModal!.id, this.giftInModal);
  }

  /**
   * Claims the current gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is unclaimed.
   */
  claimGift() {
    this.giftListService.addGiftToShoppingList(this.giftInModal!);
    this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.set(this.giftInModal!.id, {...this.giftInModal!, isClaimedByID: this.accountService.currentUserID});
    this.hideModal();
  }

  /**
   * Unclaims the current gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is unclaimed.
   */
  unclaimGift() {
    this.giftListService.deleteGiftFromShoppingList(this.giftInModal!);
    if (this.list?.type === 'shopping') {
      if (this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.size === 1) {
        delete this.list!.giftsByUser![this.giftInModal!.isWishedByID];
      } else {
        this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.delete(this.giftInModal!.id);
      }
    } else if (this.list?.type === 'wish') {
      const {isClaimedByID, ...unclaimedGift} = this.giftInModal!;
      this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.set(this.giftInModal!.id, unclaimedGift);
    }
    this.hideModal();
  }

  /**
   * Deletes the current gift displayed in `app-gift-details-modal`
   * Should only be called when gift is owned by the current user.
   */
  deleteGift() {
    if (this.list?.type === 'shopping') {
      this.giftListService.deleteGiftFromShoppingList(this.giftInModal!);
      if (this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.size === 1) {
        delete this.list!.giftsByUser![this.giftInModal!.isWishedByID];
      } else {
        this.list!.giftsByUser![this.giftInModal!.isWishedByID].gifts.delete(this.giftInModal!.id);
      }
    } else if (this.list?.type === 'wish') {
      this.giftListService.deleteGiftFromWishList(this.giftInModal!);
      this.list!.giftsByUser![this.accountService.currentUserID!].gifts.delete(this.giftInModal!.id);
    }
    this.hideModal();
  }

  /**
   * Updates the status of the current gift displayed in `app-gift-details-modal`.
   * Should only be called when gift is claimed by the current user.
   * @param status - The gift's new status.
   */
  updateStatus(status: 'claimed' | 'purchased' | 'delivered' | 'wrapped' | 'under tree') {
    try {
      if (this.giftInModal) {
        const res = updateDoc(doc(this.firebaseService.db, 'lists', this.accountService.currentUserID!, 'shopping-list', this.giftInModal.id), {
          status: status
        });
        this.list!.giftsByUser![this.giftInModal.isWishedByID].gifts.get(this.giftInModal.id)!.status = status;
        this.giftInModal = {...this.giftInModal, status: status};
      } else {
        throw Error('giftInModal does not exist.');
      }
    } catch(e) { console.error(e) }
  }

  /**
   * Determines whether the checkbox next to a gift should be checked off.
   * @param gift - The gift being checked.
   */
  getCheckType(gift: Gift): 'circle' | 'check_circle' | 'paid' | 'local_shipping' | 'featured_seasonal_and_gifts' | 'park' | 'error' {
    if (this.list!.type === 'wish') {
      if (this.list!.type === 'wish' && gift.isClaimedByID && !this.isOwnedByCurrentUser) return 'check_circle';
      return 'circle';
    } else if (this.list!.type === 'shopping') {
      if (gift.isDeleted) return 'error';
      const statusIcons = {
        'claimed': 'check_circle',
        'purchased': 'paid',
        'delivered': 'local_shipping',
        'wrapped': 'featured_seasonal_and_gifts',
        'under tree': 'park',
      } as const;
      return statusIcons[gift.status];
    }
    return 'error';
  }
}
