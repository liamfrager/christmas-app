import { Component, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../user-display/user-display.component';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FriendsService } from '../../services/friends.service';
import { User } from '../../types';

@Component({
  selector: 'app-friends-display',
  standalone: true,
  imports: [UserDisplayComponent, CommonModule],
  templateUrl: './friends-display.component.html',
  styleUrl: './friends-display.component.css'
})
export class FriendsDisplayComponent implements OnInit {
  constructor(private friendsService: FriendsService, private router: Router) { }
  friends?: Array<User>;

  async ngOnInit() {
    this.friends = await this.friendsService.getFriends()
    console.log(this.friends)
  }

  goToList(user: User) {
    this.router.navigate(['/friends/list'], {queryParams: {uid: user.id}});
  }
}