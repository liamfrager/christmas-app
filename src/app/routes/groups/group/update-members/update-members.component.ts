import { Component } from '@angular/core';
import { GroupsService } from '../../../../services/groups.service';
import { CommonModule, Location } from '@angular/common';
import { Group, GroupMembershipStatus, Member } from '../../../../types';
import { PageHeadingComponent } from '../../../../components/page-heading/page-heading.component';
import { GroupFormComponent } from '../../../../components/forms/group-form/group-form.component';
import { AccountService } from '../../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpComponent } from "../../../../components/pop-up/pop-up.component";

@Component({
  selector: 'app-update-members',
  standalone: true,
  imports: [CommonModule, GroupFormComponent, PageHeadingComponent, PopUpComponent],
  templateUrl: './update-members.component.html',
  styleUrl: './update-members.component.css'
})
export class UpdateMembersComponent {
  constructor(
    public location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private accountService: AccountService,
  ) {}

  editingGroup?: Group;
  currentUserMembershipStatus?: GroupMembershipStatus;

  ngOnInit() {
    const userID = this.accountService.currentUserID;
    const groupID = this.route.snapshot.paramMap.get('group-id');
    this.editingGroup = history.state.group;
    this.currentUserMembershipStatus = this.editingGroup?.members.find((m: any) => m.id === userID)?.membershipStatus;
    if (!this.currentUserMembershipStatus || this.currentUserMembershipStatus === 'pending') {
      this.router.navigate(['groups', groupID]);
    }
  }

  async onSubmit(allMemberships: Member[]) {
    let membersToAdd: Member[] = [];
    let membersToUpdate: Member[] = [];
    let membersToDelete: Member[] = [];
    for (let member of allMemberships) {
      switch (member.membershipStatus as string) {
        case 'admin':
        case 'member':
        case 'pending':
          membersToUpdate.push(member);
          break;
        case 'removed':
          membersToDelete.push(member);
          break;
        case 'new':
          membersToAdd.push({
            ...member,
            membershipStatus: 'pending',
            groupID: this.editingGroup!.id,
            groupName: this.editingGroup!.name,
          });
          break;
      }
    }
    await this.groupsService.addGroupMembers(membersToAdd, this.editingGroup!);
    await this.groupsService.updateGroupMembers(membersToUpdate, this.editingGroup!);
    await this.groupsService.deleteGroupMembers(membersToDelete, this.editingGroup!);
    this.location.back();
  }

  onCancel() {
    this.location.back();
  }

  handleLeaveGroup() {
    this.groupsService.deleteGroupMembers([this.accountService.currentUser as Member], this.editingGroup!);
    this.router.navigate(['groups']);
  }
}