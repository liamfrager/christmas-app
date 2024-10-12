import { Component } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { List } from '../../types';
import { CommonModule } from '@angular/common';
import { RefreshService } from '../../services/refresh.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [ListDisplayComponent, PageHeadingComponent, CommonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent {
  constructor(
    private giftListService: GiftListService,
    public router: Router,
  ) {};

  listInfo!: List;

  @RefreshService.onRefresh()
  async loadShoppingList() {
    const listInfo = await this.giftListService.getShoppingListInfo();
    if (listInfo) {
      this.listInfo = listInfo;
    }
  }
}
