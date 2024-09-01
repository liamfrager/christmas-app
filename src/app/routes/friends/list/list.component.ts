import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListDisplayComponent } from '../../../components/list-components/list-display/list-display.component';
import { List, User } from '../../../types';
import { GiftListService } from '../../../services/gift-list.service';
import { FriendsService } from '../../../services/friends.service';
import { PopUpComponent } from '../../../components/pop-up/pop-up.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [ListDisplayComponent, PopUpComponent, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class FriendsListComponent implements OnInit {
  constructor(
    private giftListService: GiftListService,
    private route: ActivatedRoute,
    private friendsService: FriendsService,
    private router: Router,
  ) {}
  listInfo!: List;
  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const userID = params['id'];
      const owner = await this.friendsService.getFriend(userID);
      if (owner) {
        if (owner.status === 'friends') { // If user is a friend.
          const listInfo = await this.giftListService.getWishListInfo(userID);
          if (listInfo) {
            this.listInfo = listInfo;
          }
        } else if (owner.status === 'unfriended') { // If user has been unfriended.
          this.listInfo = {
            type: 'unfriended',
            owner: owner,
            giftsByUser: undefined,
          }
        }
      } else { // If user is not friends.
        this.router.navigate(['/friends'])
      }
    });
  }

  onRemoveFriend() {
    this.friendsService.removeFriend(this.listInfo.owner)
    this.router.navigate(['/friends'])
  }
}
