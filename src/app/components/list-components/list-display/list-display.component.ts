import { Component, Input, OnChanges } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { DocumentData, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-list-display',
  standalone: true,
  imports: [GiftDisplayComponent, GiftDetailsModalComponent, CommonModule],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.css'
})
export class ListDisplayComponent implements OnChanges {
  constructor(private giftListService: GiftListService, private accountService: AccountService, private firebaseService: FirebaseService) {};
  @Input({required: true}) listType!: string;
  @Input() uid!: string;
  
  listOwner?: DocumentData;
  isOwnedByCurrentUser = true;
  noGiftsMessage: string = 
    this.isOwnedByCurrentUser ?
    `You have no gifts in your ${this.listType} list` :
    `${this.listOwner?.['displayName']} has no gifts in their ${this.listType} list`
  gifts: any;
  
  async ngOnChanges() {
    if (this.listType === "wish") {
      this.gifts = await this.giftListService.getListInfo(this.uid);
      this.listOwner = await this.accountService.getUserInfo(this.uid);
      const currentUserUID = await this.accountService.getCurrentUserUID();
      this.isOwnedByCurrentUser = this.listOwner?.['uid'] === currentUserUID;
    } else if (this.listType === "shopping") {
      this.updateGifts();
    } else {
      console.log(`${this.listType} is not a valid list type.`)
    }
  }

  async updateGifts() {
    console.log('updating gifts...')
    const shoppingListInfo = await this.giftListService.getShoppingListInfo();
    var result: any[] = [];
    var user = "";
    var gifts: any[] = [];
    for (let i = 0; i < shoppingListInfo.length; i++) {
      const giftRef = shoppingListInfo[i];
      if (user !== giftRef.user && user !== "") {
        const userInfo = await this.accountService.getUserInfo(user);
        result.push({
          user: userInfo,
          gifts: gifts
        });
        gifts = [];
      }
      user = giftRef.user
      const giftInfo = await getDoc(doc(this.firebaseService.db, 'lists', user, 'wish-list', giftRef.id));
      gifts.push({...giftInfo.data(), status: giftRef.status});
    }
    const userInfo = await this.accountService.getUserInfo(user);
    result.push({
      user: userInfo,
      gifts: gifts
    });
    this.gifts = result;
    console.log('updated gifts.')
  }

  highlightedGift?: any;
  highlightGift(gift?: any) {
    this.highlightedGift = {...gift};
  }

  claimGift() {
    this.giftListService.addGiftToShoppingList(this.uid, this.highlightedGift!.id);
  }

  async setStatus(status: string) {
    console.log('status: ', status)
    const currentUserUID = await this.accountService.getCurrentUserUID();
    const res = updateDoc(doc(this.firebaseService.db, 'lists', currentUserUID!, 'shopping-list', this.highlightedGift.id), {
      status: status
    })
    this.highlightedGift = {...this.highlightedGift, status: status}
    this.updateGifts();
    // TODO: gifts status isn't updating...
  }

  getIsChecked(gift: any): boolean {
    var result: boolean = false;
    if (this.listType === 'wish') {
      if (!this.isOwnedByCurrentUser && gift.isClaimed) {
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
