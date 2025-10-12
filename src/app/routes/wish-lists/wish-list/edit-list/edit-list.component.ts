import { Component, OnInit } from '@angular/core';
import { PageHeadingComponent } from "../../../../components/page-heading/page-heading.component";
import { ListFormComponent } from "../../../../components/forms/list-form/list-form.component";
import { CommonModule, Location } from '@angular/common';
import { List } from '../../../../types';
import { PopUpComponent } from "../../../../components/pop-up/pop-up.component";
import { GiftListService } from '../../../../services/gift-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, ListFormComponent, PopUpComponent],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.css'
})
export class EditListComponent implements OnInit {
  constructor(
    private giftListService: GiftListService,
    public location: Location,
    private router: Router,
  ) {}

  editingList?: List;

  ngOnInit() {
    this.editingList = history.state.list;
    console.log(this.editingList);
  }
  
  async setListArchive(isArchived: boolean) {
    await this.giftListService.setWishListArchive(this.editingList!, isArchived);
    this.router.navigate(['/wish-lists']);
  }

  async deleteList() {
    await this.giftListService.deleteWishList(this.editingList!);
    this.router.navigate(['/wish-lists']);
  }
}
