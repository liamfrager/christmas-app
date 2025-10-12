import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Friend, Group, NewGroup } from '../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { GroupsService } from '../../../services/groups.service';
import { CommonModule } from '@angular/common';
import { UserDisplayComponent } from "../../user-display/user-display.component";
import { FriendsService } from '../../../services/friends.service';
import { AccountService } from '../../../services/account.service';
import { PfpSelectComponent } from '../../pfp-select/pfp-select.component';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDisplayComponent, PfpSelectComponent],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent {
  constructor(
    private groupsService: GroupsService,
    private friendsService: FriendsService,
    private accountService: AccountService,
  ) {}
  @Input() group?: Group;
  @Input() isEditing: boolean = false;
  @Output() onFormSubmit = new EventEmitter();

  nonMemberFriends?: Friend[];
  selectedFriend?: Friend;
  // Form values
  nameVal?: string;
  descriptionVal?: string;

  async ngOnInit() {
    this.nameVal = this.group ? this.group.name : '';
    this.descriptionVal = this.group ? this.group.description : '';
    if (!this.isEditing) {
      const memberIds = new Set(this.group?.members?.map(m => m.id));
      this.nonMemberFriends = (await this.friendsService.getFriends(this.accountService.currentUserID!)).filter(f => !memberIds.has(f.id));
    }
  }

  async onSubmit(form: NgForm) {
    const newGroup: NewGroup = {
      name: form.form.value.group,
      description: form.form.value.description,
    }
    if (this.isEditing) { // If editing group.
      if (JSON.stringify(this.group) == JSON.stringify({...this.group, ...newGroup})) { // If group hasn't changed.
        this.onFormSubmit.emit(false);
      } else {
        this.groupsService.updateGroup(this.group!, newGroup);
        this.onFormSubmit.emit(newGroup);
      }
    } else {
      this.onFormSubmit.emit(this.selectedFriend);
    }
  }
}
