import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftListService } from '../../../../services/gift-list.service';
import { NewList } from '../../../../types';
import { PageHeadingComponent } from "../../../../components/page-heading/page-heading.component";
import { Location } from '@angular/common';
import { ListFormComponent } from "../../../../components/forms/list-form/list-form.component";

@Component({
  selector: 'app-add-wish-list',
  standalone: true,
  imports: [PageHeadingComponent, ListFormComponent],
  templateUrl: './add-wish-list.component.html',
  styleUrl: './add-wish-list.component.css'
})
export class AddWishListComponent {
  constructor(
    public router: Router,
    public location: Location,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
  ) {}

  async onSubmit(newList: NewList) {
    await this.giftListService.addWishList(newList);
    this.router.navigate(['/wish-lists']);
  }
}
