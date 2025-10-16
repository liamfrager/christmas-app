import { Component } from '@angular/core';
import { PageHeadingComponent } from '../../../components/page-heading/page-heading.component';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { CommonModule, Location } from '@angular/common';
import { Friend } from '../../../types';
import { RefreshService } from '../../../services/refresh.service';
import { FriendsService } from '../../../services/friends.service';

@Component({
  selector: 'app-friend-requests',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, UserDisplayComponent],
  templateUrl: './friend-requests.component.html',
  styleUrl: './friend-requests.component.css'
})
export class FriendRequestsComponent {
  constructor(
    private friendsService: FriendsService,
    public location: Location,
  ) {}

  incomingFriendRequests?: Array<Friend>;
  friendsStatuses: Record<string, string> = {};

  @RefreshService.onRefresh()
  async loadFriendData() {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
  }
}
