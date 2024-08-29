import { Component, OnInit } from '@angular/core';
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
  friends?: Array<Friend>;

  async ngOnInit() {
    this.friends = await this.friendsService.getFriends()
    console.log(this.friends)
  }

  getIcons(friend: Friend) {
    return { 'featured_seasonal_and_gifts': () => this.goToList(friend) }
  }

  goToList(user: Friend) {
    this.router.navigate(['/friends/list'], {queryParams: {uid: user.id}});
  }
}