import { Component } from '@angular/core';
import { GiftListService } from '../../../services/gift-list.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { NewGift } from '../../../types';


@Component({
  selector: 'app-add-gift',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-gift.component.html',
  styleUrl: './add-gift.component.css'
})
export class AddGiftComponent {
  constructor(private giftListService: GiftListService, private accountService: AccountService) {};

  

  async onSubmit(form: NgForm) {
    const uid = await this.accountService.getCurrentUserUID();
    if (uid) {
      const gift: NewGift = {
        name: form.form.value.name,
        url: form.form.value.url,
        details: form.form.value.details,
        isWishedBy: uid,
      }
      this.giftListService.addGiftToWishList(uid, gift)
    }
  }
}
