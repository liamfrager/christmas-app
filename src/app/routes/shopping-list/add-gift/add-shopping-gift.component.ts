import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';
import { Friend, NewGift } from '../../../types';
import { GiftListService } from '../../../services/gift-list.service';

@Component({
  selector: 'app-add-shopping-gift',
  standalone: true,
  imports: [GiftFormComponent, PageHeadingComponent],
  templateUrl: './add-shopping-gift.component.html',
  styleUrl: './add-shopping-gift.component.css'
})
export class AddShoppingGiftComponent {
  constructor (public router: Router, private giftListService: GiftListService) {}
  
  async onSubmit(gift: NewGift) {
    await this.giftListService.createGiftInShoppingList(gift, gift.isWishedByUser as Friend);
    this.router.navigate(['/shopping-list']);
  }
}
