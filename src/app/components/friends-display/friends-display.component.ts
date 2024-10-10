import { Component, Input, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../user-display/user-display.component';
import { CommonModule } from '@angular/common';
import { FriendsService } from '../../services/friends.service';
import { Friend, User } from '../../types';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-friends-display',
  standalone: true,
  imports: [UserDisplayComponent, CommonModule],
  templateUrl: './friends-display.component.html',
  styleUrl: './friends-display.component.css'
})
export class FriendsDisplayComponent implements OnInit {
  constructor(
    private friendsService: FriendsService,
    private accountService: AccountService,
  ) {}
  @Input({required: true}) userID?: string;
  user?: User;
  friends?: Array<Friend>;
  noFriendsMessage?: string;

  async ngOnInit() {
    if (this.userID) {
      this.user = await this.accountService.getUserInfo(this.userID);
      this.friends = await this.friendsService.getFriends(this.userID);
    }
    this.noFriendsMessage = `There is nobody in ${this.userID === this.accountService.currentUserID ? 'your' : this.user?.displayName + "'s"} friends list.`;
  }
}