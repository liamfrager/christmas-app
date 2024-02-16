import { Component, Input, OnChanges } from '@angular/core';
import { GiftDisplayComponent } from '../gift-display/gift-display.component';
import { GiftListService } from '../../services/gift-list.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { DocumentData } from 'firebase/firestore';
import { GiftDetailsModalComponent } from '../gift-details-modal/gift-details-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-display',
  standalone: true,
  imports: [GiftDisplayComponent, GiftDetailsModalComponent, CommonModule],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.css'
})
export class ListDisplayComponent implements OnChanges {
  constructor(private giftListService: GiftListService, private accountService: AccountService) {};
  @Input({required: true}) uid: string = "no user found";
  
  listOwner?: DocumentData;
  gifts: any;
  
  async ngOnChanges() {
    this.gifts = await this.giftListService.getListInfo(this.uid);
    console.log(this.gifts.length);
    this.listOwner = await this.accountService.getUserInfo(this.uid);
  }

  highlightedGift?: Observable<any>;
  highlightGift(gift: any) {
    this.highlightedGift = gift;
  }
  unhighlightGift() {
    this.highlightedGift = undefined;
  }

  claimGift(gift: any) {
    console.log("gift claimed:", gift);
  }

}
