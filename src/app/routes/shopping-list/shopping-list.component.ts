import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { Router } from '@angular/router';
import { GiftListService } from '../../services/gift-list.service';
import { List, User } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [ListDisplayComponent, PageHeadingComponent, CommonModule],
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
    try {
      const listInfo = await this.giftListService.getShoppingListInfo();
      if (listInfo) {
        this.listInfo = listInfo;
      }
    } catch (error) {
      console.error('Error loading shopping list info:', error);
      this.listInfo = {
        type: 'error',
        owner: {} as User,
        giftsByUser: {},
      }
    }
  }
}
