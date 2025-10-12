import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, Member } from '../../../types';
import { GroupsService } from '../../../services/groups.service';
import { PageHeadingComponent } from '../../../components/page-heading/page-heading.component';
import { CommonModule, Location } from '@angular/common';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { GiftExchangeComponent } from '../../../components/gift-exchange/gift-exchange.component';
import { AccountService } from '../../../services/account.service';
import { IconComponent } from "../../../components/icon/icon.component";

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, UserDisplayComponent, GiftExchangeComponent, IconComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent {
  constructor(
    private accountService: AccountService,
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    public location: Location,
    private router: Router,
  ) {};
  
  groupID: string = this.route.snapshot.paramMap.get('group-id')!;
  group?: Group;
  showBackButton: boolean = true;
  currentUserMembershipStatus?: 'member' | 'admin' | 'pending';
  membershipStatusIcons = {
    'member': 'person',
    'admin': 'person_shield',
    'pending': 'schedule',
  }

  async ngOnInit() {
    this.group = await this.groupsService.getGroup(this.groupID);
    const isMember = this.group.members?.find(m => m.id === this.accountService.currentUserID);
    this.currentUserMembershipStatus = isMember ? isMember.membershipStatus : undefined;
  }

  onIconClick(icon: string) {
    if (icon === 'person_edit')
      this.router.navigate(['groups', this.groupID, 'update-members'], { state: { group: this.group } });
    if (icon === 'edit_note')
      this.router.navigate(['groups', this.groupID, 'edit-group'], { state: { group: this.group } });
  }

  acceptGroupRequest() {
    if (this.group) {
      this.groupsService.acceptGroupRequest(this.accountService.currentUser as Member, this.group);
      this.currentUserMembershipStatus = 'member';
      this.group.members!.push({
        ...this.accountService.currentUser,
        membershipStatus: 'member',
      } as Member)
    }
  }

  rejectGroupRequest() {
    if (this.group) {
    this.groupsService.removeMemberFromGroup(this.accountService.currentUser as Member, this.group);
    this.currentUserMembershipStatus = undefined;
    this.group.members!.filter(m => m.id !== this.accountService.currentUserID);}
  }
}
