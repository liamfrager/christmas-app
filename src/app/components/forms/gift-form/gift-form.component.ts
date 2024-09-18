import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { Router } from '@angular/router';
import { Friend, Gift, NewGift } from '../../../types';
import { PageHeadingComponent } from "../../page-heading/page-heading.component";
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {}
  @Input({required: true}) type!: 'wish' | 'shopping';
  @Input() gift?: Gift;
  
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
    const gift: NewGift = {
      name: form.form.value.gift,
      url: form.form.value.url,
      details: form.form.value.details,
      isWishedByID: form.form.value.friend.id,
    }
    this.giftListService.createGiftInShoppingList(gift, this.selectedFriend!); // Must check that a user is selected.
    this.router.navigate(['./shopping-list'])
  }
}
