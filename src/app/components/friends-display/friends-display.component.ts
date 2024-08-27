import { Component } from '@angular/core';
import { UserDisplayComponent } from '../user-display/user-display.component';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends-display',
  standalone: true,
  imports: [UserDisplayComponent, CommonModule],
  templateUrl: './friends-display.component.html',
  styleUrl: './friends-display.component.css'
})
export class FriendsDisplayComponent {
  constructor(private accountService: AccountService, private router: Router) {
    this.friends = this.accountService.currentUser.friends
  }
  friends?: string[];

  goToList(uid: string) {
    this.router.navigate(['/friends/list'], {queryParams: {uid: uid}});
  }
}