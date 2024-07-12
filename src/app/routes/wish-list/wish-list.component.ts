import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { List } from '../../types';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [ListDisplayComponent, PageHeadingComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  constructor(private accountService: AccountService, private giftListService: GiftListService, private router: Router) {};
  listInfo!: List;
  headingButtons = ['filter_list', 'forms_add_on'];
  onHeadingIconClick(e: any) {
    switch (e) {
      case 'filter_list':
        console.log('filter');
        break;
      case 'forms_add_on':
        this.router.navigate(['/wish-list/add-gift']);
        break;
      default:
        break;
    }
  }

  async ngOnInit() {
    const uid = await this.accountService.getCurrentUserID();
    if (uid) {
      const listInfo = await this.giftListService.getWishListInfo(uid);
      if (listInfo) {
        this.listInfo = listInfo;
      }
    }
  }

}
