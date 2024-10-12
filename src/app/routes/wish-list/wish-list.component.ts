import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Friend, List, User } from '../../types';
import { FriendsService } from '../../services/friends.service';
import { CommonModule, Location } from '@angular/common';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, ListDisplayComponent, PageHeadingComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  constructor(
    public accountService: AccountService,
    private friendsService: FriendsService,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
    public router: Router,
    public location: Location,
  ) {};
  listInfo!: List;
  IDParam: string | undefined | null;
  user?: User | Friend;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('id');
    this.IDParam = IDParam;
    if (this.IDParam) {
      if (this.IDParam !== this.accountService.currentUserID) {
        this.user = await this.friendsService.getFriend(this.IDParam);
        if (this.user!.status !== 'friends') {
          this.listInfo = { type: 'not-friends', owner: this.user } as List;
        }
      } else {
        this.user = this.accountService.currentUser;
      }
    } else {
      this.user = this.accountService.currentUser;
    }
  }

  @RefreshService.onRefresh()
  async loadListInfo() {
    const listInfo = await this.giftListService.getWishListInfo(this.user?.id!);
    if (listInfo)
      this.listInfo = listInfo;
  }
}
