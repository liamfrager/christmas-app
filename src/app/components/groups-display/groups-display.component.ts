import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group, User } from '../../types';
import { AccountService } from '../../services/account.service';
import { RefreshService } from '../../services/refresh.service';
import { GroupsService } from '../../services/groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './groups-display.component.html',
  styleUrl: './groups-display.component.css'
})
export class GroupsDisplayComponent implements OnInit {
  constructor(
    private groupsService: GroupsService,
    private accountService: AccountService,
    private router: Router,
  ) {}
  @Input({required: true}) userID?: string;
  user?: User;
  groups?: Group[];
  noGroupsMessage?: string;

  async ngOnInit() {
    if (this.userID) {
      this.user = await this.accountService.getUserInfo(this.userID);
    }
    this.noGroupsMessage = `${this.userID === this.accountService.currentUserID ? 'You are' : this.user?.displayName + " is"} not a part of any groups.`;
  }

  @RefreshService.onRefresh()
  async loadGroups() {
    if (this.userID)
      this.groups = await this.groupsService.getAllGroupsForUser(this.userID);
  }

  goToGroup(groupID: string) {
    this.router.navigate(['groups', groupID]);
  }
}