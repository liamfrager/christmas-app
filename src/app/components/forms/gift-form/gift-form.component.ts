import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { Friend, Gift, NewGift, WishLists } from '../../../types';
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
  ) {}
  @Input({required: true}) type!: 'wish' | 'shopping';
  @Input() gift?: Gift;
  @Output() onFormSubmit = new EventEmitter();
  
  friends: Array<Friend> = [];
  lists: WishLists | null = null;
  selectedFriend?: Friend;
  // Form values
  nameVal?: string;
  urlVal?: string;
  detailsVal?: string;
  listVal?: string;

  async ngOnInit() {
    this.nameVal = this.gift ? this.gift.name : '';
    this.urlVal = this.gift ? this.gift.url : '';
    this.detailsVal = this.gift ? this.gift.details : '';
    this.listVal = this.gift ? this.gift.isWishedOnListID : this.route.snapshot.paramMap.get('list-id')!;
    if (this.type === 'shopping') {
      this.friends = await this.friendsService.getFriends(this.accountService.currentUserID!)
    }
    this.lists = await this.giftListService.getAllWishLists(this.accountService.currentUser);
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
      isWishedOnListID: form.form.value.list ? form.form.value.list : this.listVal,
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
