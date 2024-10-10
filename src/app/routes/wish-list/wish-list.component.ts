import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from '../../types';
import { FriendsService } from '../../services/friends.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, ListDisplayComponent, PageHeadingComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private friendsService: FriendsService,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
    public router: Router
  ) {};
  listInfo!: List;
  IDParam: string | undefined | null;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('id');
    this.IDParam = IDParam;
    if (IDParam) {
      if (IDParam === this.accountService.currentUserID)
        this.router.navigate(['/wish-list']);
      const friend = await this.friendsService.getFriend(IDParam);
      if (friend!.status !== 'friends') {
        this.listInfo = { type: 'not-friends', owner: friend } as List;
        return;
      }
    } else {
      IDParam = this.accountService.currentUserID;
    }
    const listInfo = await this.giftListService.getWishListInfo(IDParam!);
    if (listInfo)
      this.listInfo = listInfo;
  }

}
