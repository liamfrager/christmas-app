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

  /**
   * Returns icons and functions to be used in app-user-display.iconActions.
   * @param friend - A User object representing the friend being displayed.
   */
  getIconActions(friend: User | Friend): Map<string, () => void> {
    return new Map([['featured_seasonal_and_gifts', () => this.goToList(friend)]])
  }

  /**
   * Reroutes the webpage to a given user's wish-list.
   * @param user - A User object representing the user whose wish-list the webpage will be rerouted to.
   */
  goToList(user: User) {
    this.router.navigate(['/friends/list'], {queryParams: {id: user.id}});
  }
}