import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListDisplayComponent } from '../../../components/list-components/list-display/list-display.component';
import { List } from '../../../types';
import { GiftListService } from '../../../services/gift-list.service';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [ListDisplayComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class FriendsListComponent implements OnInit {
  constructor(private giftListService: GiftListService, private route: ActivatedRoute) {}
  listInfo!: List;
  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const listInfo = await this.giftListService.getWishListInfo(params['uid']);
      if (listInfo) {
        this.listInfo = listInfo;
      }
    });
  }
}
