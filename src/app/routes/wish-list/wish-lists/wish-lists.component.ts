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
    if (this.IDParam) {
      if (this.IDParam !== this.accountService.currentUserID) {
        this.user = await this.friendsService.getFriend(this.IDParam);
        if (this.user!.status !== 'friends') {
          this.wishLists = { type: 'not-friends', owner: this.user } as WishLists;
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
    const wishLists = await this.giftListService.getAllWishLists(this.user!);
    if (wishLists)
      this.wishLists = wishLists;
  }
}
