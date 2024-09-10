import { Component, OnInit } from '@angular/core';
import { GiftListService } from '../../../services/gift-list.service';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Friend, NewGift } from '../../../types';
import { CommonModule } from '@angular/common';
import { FriendsService } from '../../../services/friends.service';
import { PfpSelectComponent } from '../../../components/pfp-select/pfp-select.component';

@Component({
  selector: 'app-add-shopping-gift',
  standalone: true,
  imports: [CommonModule, FormsModule, PfpSelectComponent],
  templateUrl: './add-shopping-gift.component.html',
  styleUrl: './add-shopping-gift.component.css'
})
export class AddShoppingGiftComponent implements OnInit {
  constructor(
    private giftListService: GiftListService, 
    private accountService: AccountService,
    private friendsService: FriendsService,
    private router: Router
  ) {}
  
  friends!: Array<Friend>
  selectedFriend?: Friend;
  
  async ngOnInit() {
    this.friends = await this.friendsService.getFriends()
  }

  onSubmit(form: NgForm) {
    const gift: NewGift = {
      name: form.form.value.name,
      url: form.form.value.url,
      details: form.form.value.details,
      isWishedByID: form.form.value.friend.id,
    }
    this.giftListService.createGiftInShoppingList(gift, this.selectedFriend!); // Must check that a user is selected.
    this.router.navigate(['./shopping-list'])
  }
}
