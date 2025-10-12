import { Component } from '@angular/core';
import { GroupsService } from '../../../../services/groups.service';
import { Location } from '@angular/common';
import { Group, Member } from '../../../../types';
import { PageHeadingComponent } from '../../../../components/page-heading/page-heading.component';
import { GroupFormComponent } from '../../../../components/forms/group-form/group-form.component';

@Component({
  selector: 'app-update-members',
  standalone: true,
  imports: [GroupFormComponent, PageHeadingComponent],
  templateUrl: './update-members.component.html',
  styleUrl: './update-members.component.css'
})
export class UpdateMembersComponent {
  constructor(
    public location: Location,
    private groupsService: GroupsService,
  ) {}

  editingGroup?: Group;

  ngOnInit() {
    this.editingGroup = history.state.group;
  }

  async onSubmit(updatedMemberships: Member[]) {
    await this.groupsService.updateGroupMembers(this.editingGroup!, updatedMemberships);
    this.location.back();
  }

  onCancel() {
    this.location.back();
  }
}