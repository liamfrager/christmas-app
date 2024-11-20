import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { ActivatedRoute, Router } from '@angular/router';
import { GiftListService } from '../../../services/gift-list.service';
import { NewGift } from '../../../types';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-wish-gift',
  standalone: true,
  imports: [GiftFormComponent, PageHeadingComponent],
  templateUrl: './add-wish-gift.component.html',
  styleUrl: './add-wish-gift.component.css'
})
export class AddWishGiftComponent {
  constructor(
    public router: Router,
    public location: Location,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
  ) {}

  async onSubmit(gift: NewGift) {
    const listID = this.route.snapshot.paramMap.get('list-id')!;
    await this.giftListService.addGiftToWishList(gift, listID);
    this.router.navigate(['wish-lists', listID]);
  }
}
