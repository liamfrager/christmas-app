import { Component, Input, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../user-display/user-display.component';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FriendsService } from '../../services/friends.service';
import { Friend, User } from '../../types';

@Component({
  selector: 'app-friends-display',
  standalone: true,
  imports: [UserDisplayComponent, CommonModule],
  templateUrl: './friends-display.component.html',
  styleUrl: './friends-display.component.css'
})
export class FriendsDisplayComponent implements OnInit {
  constructor(private friendsService: FriendsService, private router: Router) { }
  @Input({required: true}) userID?: string;
  friends?: Array<Friend>;

  async ngOnInit() {
    this.friends = await this.friendsService.getFriends(this.userID);
  }
}