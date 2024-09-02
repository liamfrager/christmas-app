import { Component } from '@angular/core';
import { GiftListService } from '../../../services/gift-list.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { NewGift } from '../../../types';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-wish-gift',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-wish-gift.component.html',
  styleUrl: './add-wish-gift.component.css'
})
export class AddWishGiftComponent {
  constructor(
    private giftListService: GiftListService, 
    private accountService: AccountService,
    private router: Router) {};

  onSubmit(form: NgForm) {
    const gift: NewGift = {
      name: form.form.value.name,
      url: form.form.value.url,
      details: form.form.value.details,
      isWishedByID: this.accountService.currentUser.id,
    }
    this.giftListService.addGiftToWishList(gift)
    this.router.navigate(['./wish-list'])
  }
}
