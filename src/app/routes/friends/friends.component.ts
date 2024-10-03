import { Component, OnInit } from '@angular/core';
import { FriendsDisplayComponent } from '../../components/friends-display/friends-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FriendsService } from '../../services/friends.service';
import { Friend } from '../../types';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [FriendsDisplayComponent, PageHeadingComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
  ) {};
  userID?: string;
  headingButtons = ['filter_list', 'person_add'];

  onHeadingIconClick(e: any) {
    switch (e) {
      case 'filter_list':
        // TODO: add sorting capabilities
        console.log('filter')
        break;
      case 'person_add':
        this.router.navigate(['/friends/add-friend']);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    const userID = this.route.snapshot.paramMap.get('id');
    if (userID) {
      if (userID === this.accountService.currentUserID) {
        this.router.navigate(['/friends']);
      }
      this.userID = userID;
    } else {
      this.userID = this.accountService.currentUserID;
    }
  }
}
