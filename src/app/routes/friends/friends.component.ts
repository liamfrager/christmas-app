import { Component, OnInit } from '@angular/core';
import { FriendsDisplayComponent } from '../../components/friends-display/friends-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { FriendsService } from '../../services/friends.service';
import { User } from '../../types';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FriendsDisplayComponent, PageHeadingComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
  ) {};
  IDParam: string | undefined | null;
  user?: User;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('id');
    this.IDParam = IDParam;
    if (IDParam) {
      if (IDParam === this.accountService.currentUserID)
        this.router.navigate(['/friends']);
      else
        this.user = await this.accountService.getUserInfo(IDParam);
    } else {
      this.user = this.accountService.currentUser;
    }
  }
}
