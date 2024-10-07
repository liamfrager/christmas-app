import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';
import { GiftListService } from '../../../services/gift-list.service';
import { NewGift } from '../../../types';


@Component({
  selector: 'app-add-wish-gift',
  standalone: true,
  imports: [GiftFormComponent, PageHeadingComponent],
  templateUrl: './add-wish-gift.component.html',
  styleUrl: './add-wish-gift.component.css'
})
export class AddWishGiftComponent {
  constructor(public router: Router, private giftListService: GiftListService) {}

  async onSubmit(gift: NewGift) {
    await this.giftListService.addGiftToWishList(gift);
    this.router.navigate(['/wish-list']);
  }
}
