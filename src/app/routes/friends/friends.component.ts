import { Component, OnInit } from '@angular/core';
import { FriendsDisplayComponent } from '../../components/friends-display/friends-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../types';
import { RefreshService } from '../../services/refresh.service';

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
    public accountService: AccountService,
    public location: Location,
  ) {};
  IDParam: string | undefined | null;
  user?: User;

  async ngOnInit() {
    let IDParam: string | undefined | null = this.route.snapshot.paramMap.get('id');
    this.IDParam = IDParam;
  }

  @RefreshService.onRefresh()
  async onRefresh() {
    if (this.IDParam) {
      this.user = await this.accountService.getUserInfo(this.IDParam);
    } else {
      this.user = this.accountService.currentUser;
    }
  }
}
