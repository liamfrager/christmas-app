import { Component, Input, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../user-display/user-display.component';
import { CommonModule } from '@angular/common';
import { Group, User } from '../../types';
import { AccountService } from '../../services/account.service';
import { RefreshService } from '../../services/refresh.service';
import { GroupsService } from '../../services/groups.service';

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
}