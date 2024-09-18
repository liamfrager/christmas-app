import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { Friend, Gift, NewGift } from '../../../types';
import { PageHeadingComponent } from "../../page-heading/page-heading.component";
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-gift-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadingComponent, PfpSelectComponent],
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
      this.friends = await this.friendsService.getFriends()
    }
  }

  onSubmit(form: NgForm) {
    const new_gift: NewGift = {
      name: form.form.value.gift,
      url: form.form.value.url,
      details: form.form.value.details,
      isWishedByID: this.gift?.isCustom ? form.form.value.friend.id : this.accountService.currentUser.id,
    }
    if (this.gift) { // If gift already exists.
      this.giftListService.updateGift(this.gift, new_gift);
    } else {
      this.giftListService.createGiftInShoppingList(new_gift, this.selectedFriend!);
    }
    this.onFormSubmit.emit(new_gift);
  }
}
