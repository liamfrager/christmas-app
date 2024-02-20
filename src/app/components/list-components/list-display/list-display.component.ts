import { Component, Input, OnChanges } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { DocumentData } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';

@Component({
  selector: 'app-list-display',
  standalone: true,
  imports: [GiftDisplayComponent, GiftDetailsModalComponent, CommonModule],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.css'
})
export class ListDisplayComponent implements OnChanges {
  constructor(private giftListService: GiftListService, private accountService: AccountService) {};
  @Input({required: true}) listType?: string;
  @Input() uid: string = "no user found";
  
  listOwner?: DocumentData;
  isOwnedByCurrentUser: boolean = false;
  gifts: any;
  
  async ngOnChanges() {
    if (this.listType === "wish") {
      this.gifts = await this.giftListService.getListInfo(this.uid);
      this.listOwner = await this.accountService.getUserInfo(this.uid);
      const currentUserUID = await this.accountService.getCurrentUserUID();
      this.isOwnedByCurrentUser = this.listOwner?.['uid'] === currentUserUID;
    } else if (this.listType === "shopping") {
      this.gifts = await this.giftListService.getShoppingListInfo();
    } else {
      console.log(`${this.listType} is not a valid list type.`)
    }
  }

  highlightedGift?: any;
  highlightGift(gift?: any) {
    this.highlightedGift = {...gift};
  }

  claimGift(gift: any) {
    this.giftListService.addGiftToShoppingList(this.uid, this.highlightedGift!.id);
    console.log("gift claimed:", gift);
  }

}
