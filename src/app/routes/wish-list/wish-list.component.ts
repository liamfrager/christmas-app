import { Component, Input, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-components/list-display/list-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { GiftListService } from '../../services/gift-list.service';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Friend, Gift, List, User } from '../../types';
import { FriendsService } from '../../services/friends.service';
import { CommonModule, Location } from '@angular/common';
import { RefreshService } from '../../services/refresh.service';
import { PopUpComponent } from "../../components/pop-up/pop-up.component";

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, ListDisplayComponent, PageHeadingComponent, PopUpComponent],
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
    private location: Location,
  ) {};
  listInfo!: List;
  IDParam: string | undefined | null;
  listID: string = this.route.snapshot.paramMap.get('list-id')!;
  user?: User | Friend;
  isModalOpen: boolean = false;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('user-id');
    this.IDParam = IDParam;
    this.user = this.IDParam && this.IDParam !== this.accountService.currentUserID
      ? await this.friendsService.getFriend(this.IDParam)
      : this.accountService.currentUser;
  }

  @RefreshService.onRefresh()
  async loadListInfo() {
    const listInfo = this.user!.status === 'friends' || this.user!.id === this.accountService.currentUserID
      ? await this.giftListService.getWishListInfo(this.user!.id, this.listID!)
      : { type: 'not-friends', owner: this.user } as List;
    if (listInfo)
      this.listInfo = listInfo;
  }

  goBack() {
    window.history.go(this.route.snapshot.queryParamMap.get('rerouted') === 'true' ? -2 : -1);
  }

  async deleteList() {
    await this.giftListService.deleteWishList(this.listInfo);
    this.router.navigate(['/wish-lists'])
  }
}
