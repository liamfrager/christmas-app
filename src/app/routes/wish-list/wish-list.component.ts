import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from '../../types';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [ListDisplayComponent, PageHeadingComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private friendsService: FriendsService,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
    private router: Router
  ) {};
  listInfo!: List;
  headingButtons: string[] = [];
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
    let userID: string | undefined | null = this.route.snapshot.paramMap.get('id');
    if (userID) {
      if (userID === this.accountService.currentUserID)
        this.router.navigate(['/wish-list']);
      const friend = await this.friendsService.getFriend(userID);
      if (friend!.status !== 'friends') {
        this.listInfo = { type: 'not-friends', owner: friend } as List;
        return;
      }
    } else {
      userID = this.accountService.currentUserID;
      this.headingButtons = ['filter_list', 'forms_add_on'];
    }
    const listInfo = await this.giftListService.getWishListInfo(userID!);
    if (listInfo)
      this.listInfo = listInfo;
  }

}
