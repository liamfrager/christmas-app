import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Friend, Group, GroupMembershipStatus, Member, NewGroup, User } from '../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDisplayComponent } from "../../user-display/user-display.component";
import { FriendsService } from '../../../services/friends.service';
import { AccountService } from '../../../services/account.service';
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';
import { EditGroupMembershipPopUpComponent } from "../edit-group-membership-pop-up/edit-group-membership-pop-up.component";
import { IconComponent } from "../../icon/icon.component";

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDisplayComponent, PfpSelectComponent, EditGroupMembershipPopUpComponent, IconComponent],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent {
  constructor(
    private friendsService: FriendsService,
    private accountService: AccountService,
  ) {}
  @Input() group?: Group;
  @Input() isEditingGroup: boolean = false;
  @Input() isEditingMemberships: boolean = false;
  @Output() onFormSubmit = new EventEmitter();

  nonMemberFriends: Friend[] = [];
  selectedFriend?: Friend;
  // Form values
  nameVal?: string;
  descriptionVal?: string;
  newMembers: (User | null)[] = [];
  updatedMembershipStatuses: Record<string, GroupMembershipStatus | null> = {};
  membershipStatusIcons = {
    'member': 'person',
    'admin': 'person_shield',
    'pending': 'schedule',
    'removed': 'person_off',
    'new': null,
  }
  editingMembershipMember?: Member;

  async ngOnInit() {
    if (this.isEditingGroup) {
      this.nameVal = this.group ? this.group.name : '';
      this.descriptionVal = this.group ? this.group.description : '';
    }
    if (this.isEditingMemberships) {
      const memberIds = new Set(this.group?.members?.map(m => m.id));
      this.nonMemberFriends = (await this.friendsService.getFriends(this.accountService.currentUserID!)).filter(f => !memberIds.has(f.id));
      this.group!.members!.forEach(m => this.updatedMembershipStatuses[m.id] = m.membershipStatus);
    }
  }

  addNewMember() {
    if (this.newMembers.length < this.nonMemberFriends.length) {
      this.newMembers.push(null);
    }
  }

  removeNewMember(index: number) {
    const removedMember = this.newMembers.splice(index, 1);
  }

  getAvailableFriends(index: number) {
    const selectedIds = this.newMembers.filter(m => m).map(m => m!.id);
    return this.nonMemberFriends.filter(f => !selectedIds.includes(f.id));
  }

  onSelectFriend(selected: User | undefined, index: number) {
    this.newMembers[index] = selected!;
  }

  editMembershipStatus(member: Member) {
    this.editingMembershipMember = member;
  }

  handlePopUpClose(event: GroupMembershipStatus | null) {
    if (event) {
      this.updatedMembershipStatuses[this.editingMembershipMember!.id] = event;
    }
    this.editingMembershipMember = undefined;
  }

  async onSubmit(form: NgForm) {
    const newGroup: NewGroup = {
      name: form.form.value.group,
      description: form.form.value.description ?? '',
    }
    if (this.group) {
      if (this.isEditingGroup) {
        if (JSON.stringify(this.group) == JSON.stringify({...this.group, ...newGroup})) { // If group hasn't changed.
          this.onFormSubmit.emit(null);
        } else {
          this.onFormSubmit.emit({...this.group, ...newGroup});
        }
      } else if (this.isEditingMemberships) {
        const updatedMemberships = this.group.members.map(m => ({
          ...m,
          membershipStatus: this.updatedMembershipStatuses[m.id]
        }));
        for (let m of this.newMembers) {
          updatedMemberships.push({
            ...m,
            membershipStatus: 'new',
          } as Member)
        }
        this.onFormSubmit.emit(updatedMemberships);
      }
    } else {
      this.onFormSubmit.emit(newGroup);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
