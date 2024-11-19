import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { Friend, Gift, NewGift } from '../../../types';
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-gift-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PfpSelectComponent],
  templateUrl: './gift-form.component.html',
  styleUrl: './gift-form.component.css'
})
export class GiftFormComponent {
  constructor(
    private giftListService: GiftListService, 
    private friendsService: FriendsService,
    private accountService: AccountService,
  ) {}
  @Input({required: true}) type!: 'wish' | 'shopping';
  @Input() gift?: Gift;
  @Output() onFormSubmit = new EventEmitter();
  
  friends: Array<Friend> = [];
  selectedFriend?: Friend;
  // Form values
  nameVal?: string;
  urlVal?: string;
  detailsVal?: string;

  async ngOnInit() {
    this.nameVal = this.gift ? this.gift.name : '';
    this.urlVal = this.gift ? this.gift.url : '';
    this.detailsVal = this.gift ? this.gift.details : '';
    if (this.type === 'shopping') {
      this.friends = await this.friendsService.getFriends(this.accountService.currentUserID!)
    }
  }

  async onSubmit(form: NgForm) {
    const isWishedByID = this.type === 'shopping' ? form.form.value.friend.id : this.accountService.currentUserID
    const isWishedByUser = this.gift?.isWishedByID === isWishedByID ? this.gift?.isWishedByUser : await this.accountService.getUserInfo(isWishedByID);
    const newGift: NewGift = {
      name: form.form.value.gift,
      url: form.form.value.url,
      details: form.form.value.details,
      isWishedByID: isWishedByID,
      isWishedByUser: isWishedByUser,
    }
    if (this.gift) { // If editing gift.
      if (JSON.stringify(this.gift) == JSON.stringify({...this.gift, ...newGift})) { // If gift hasn't changed.
        this.onFormSubmit.emit(false);
      } else {
        this.giftListService.updateGift(this.gift, newGift);
        this.onFormSubmit.emit(newGift);
      }
    } else {
      this.onFormSubmit.emit(newGift);
    }
  }
}
