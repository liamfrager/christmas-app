import { Component } from '@angular/core';
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { CommonModule, Location } from '@angular/common';
import { GroupsService } from '../../../services/groups.service';
import { Member } from '../../../types';
import { RefreshService } from '../../../services/refresh.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-requests',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent],
  templateUrl: './group-requests.component.html',
  styleUrl: './group-requests.component.css'
})
export class GroupRequestsComponent {
  constructor(
    private groupsService: GroupsService,
    private router: Router,
    public location: Location,
  ) {}

  incomingGroupRequests?: Member[];
  friendsStatuses: Record<string, string> = {};

  @RefreshService.onRefresh()
  async loadGroupData() {
    this.incomingGroupRequests = await this.groupsService.getGroupRequests();
    console.log(this.incomingGroupRequests);
  }

  goToGroup(group: Member) {
    this.router.navigate(['groups', group.groupID]);
  }
}
