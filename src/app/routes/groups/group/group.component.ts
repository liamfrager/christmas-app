import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, GroupMembershipStatus, Member } from '../../../types';
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
  headerButtons: string[] = [];
  currentUserMembershipStatus?: GroupMembershipStatus;
  membershipStatusIcons = {
    'member': 'person',
    'admin': 'person_shield',
    'pending': 'schedule',
    'removed': 'person_off',
    'new': null,
  }

  async ngOnInit() {
    this.group = await this.groupsService.getGroup(this.groupID);
    const isMember = this.group.members?.find(m => m.id === this.accountService.currentUserID);
    this.currentUserMembershipStatus = isMember ? isMember.membershipStatus : undefined;
    if (this.currentUserMembershipStatus === 'admin') this.headerButtons = ['edit_note', 'person_edit']
    if (this.currentUserMembershipStatus === 'member') this.headerButtons = ['person_edit']
  }

  onIconClick(icon: string) {
    if (icon === 'person_edit')
      this.router.navigate(['groups', this.groupID, 'memberhsip'], { state: { group: this.group } });
    if (icon === 'edit_note')
      this.router.navigate(['groups', this.groupID, 'edit-group'], { state: { group: this.group } });
  }

  acceptGroupRequest() {
    if (this.group) {
      const acceptedMember = {
        ...this.accountService.currentUser,
        membershipStatus: 'member',
      } as Member
      this.groupsService.addGroupMembers([acceptedMember], this.group);
      this.currentUserMembershipStatus = 'member';
      this.headerButtons = ['person_edit'];
      this.group.members!.push(acceptedMember);
    }
  }

  rejectGroupRequest() {
    if (this.group) {
      this.groupsService.deleteGroupMembers([this.accountService.currentUser as Member], this.group);
      this.currentUserMembershipStatus = undefined;
      this.group.members = this.group.members.filter(m => m.id !== this.accountService.currentUserID);
    }
  }
}
