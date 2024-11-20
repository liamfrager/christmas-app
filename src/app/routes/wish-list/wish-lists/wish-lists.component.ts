import { Component } from '@angular/core';
import { ListsDisplayComponent } from "../../../components/list-components/lists-display/lists-display.component";
import { AccountService } from '../../../services/account.service';
import { FriendsService } from '../../../services/friends.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Friend, User, WishLists } from '../../../types';
import { GiftListService } from '../../../services/gift-list.service';
import { RefreshService } from '../../../services/refresh.service';
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { CommonModule, Location} from '@angular/common';

@Component({
  selector: 'app-wish-lists',
  standalone: true,
  imports: [CommonModule, ListsDisplayComponent, PageHeadingComponent],
  templateUrl: './wish-lists.component.html',
  styleUrl: './wish-lists.component.css'
})
export class WishListsComponent {
  constructor(
    public accountService: AccountService,
    private friendsService: FriendsService,
    private giftListService: GiftListService,
    private route: ActivatedRoute,
    public router: Router,
    public location: Location,
  ) {};
  
  IDParam: string | undefined | null;
  user?: User | Friend;
  wishLists!: WishLists;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('user-id');
    this.IDParam = IDParam;
    this.user = this.IDParam && this.IDParam !== this.accountService.currentUserID
      ? await this.friendsService.getFriend(this.IDParam)
      : this.accountService.currentUser;
  }

  @RefreshService.onRefresh()
  async loadListInfo() {
    const wishLists = this.user!.status === 'friends' || this.user!.id === this.accountService.currentUserID
      ? await this.giftListService.getAllWishLists(this.user!)
      : { type: 'not-friends', owner: this.user } as WishLists;
    if (wishLists)
      if (this.IDParam && this.IDParam !== this.accountService.currentUserID && wishLists.lists.length == 1) {
        this.router.navigate(['profile', this.IDParam, 'wish-lists', wishLists.lists[0].id], { queryParams: { rerouted: true } });
      }
      this.wishLists = wishLists;
  }
}
