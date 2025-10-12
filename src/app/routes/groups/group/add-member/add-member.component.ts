import { Component } from '@angular/core';
import { GroupsService } from '../../../../services/groups.service';
import { Location } from '@angular/common';
import { Group, Member, User } from '../../../../types';
import { PageHeadingComponent } from '../../../../components/page-heading/page-heading.component';
import { GroupFormComponent } from '../../../../components/forms/group-form/group-form.component';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [GroupFormComponent, PageHeadingComponent],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.css'
})
export class AddMemberComponent {
  constructor(
    public location: Location,
    private groupsService: GroupsService,
  ) {}

  editingGroup?: Group;

  ngOnInit() {
    this.editingGroup = history.state.group;
  }

  async onSubmit(user: User) {
    const group = history.state.group;
    const member: Member = {
      ...user,
      groupID: group.id,
      groupName: group.name,
      membershipStatus: 'pending',
    }
    await this.groupsService.addMemberToGroup(member, group);
    this.location.back()
  }
}