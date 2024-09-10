import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { Router } from '@angular/router';
import { Friend, NewGift } from '../../../types';
import { PageHeadingComponent } from "../../page-heading/page-heading.component";
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';

@Component({
  selector: 'app-gift-form',
  standalone: true,
  imports: [FormsModule, PageHeadingComponent, PfpSelectComponent],
  templateUrl: './gift-form.component.html',
  styleUrl: './gift-form.component.css'
})
export class GiftFormComponent {
  constructor(
    private giftListService: GiftListService, 
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
