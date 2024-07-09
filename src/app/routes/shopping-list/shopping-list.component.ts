import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { Router } from '@angular/router';
import { GiftListService } from '../../services/gift-list.service';
import { List } from '../../types';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [ListDisplayComponent, PageHeadingComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit {
  constructor(private giftListService: GiftListService, private router: Router) {};
  listInfo!: List;
  headingButtons = ['forms_add_on'];
  onHeadingIconClick(e: any) {
    switch (e) {
      case 'forms_add_on':
        this.router.navigate(['/shopping-list/add'])
        break;
    
      default:
        break;
    }
  }

  async ngOnInit() {
    const listInfo = await this.giftListService.getShoppingListInfo();
    if (listInfo) {
      this.listInfo = listInfo;
    }
  }
}
