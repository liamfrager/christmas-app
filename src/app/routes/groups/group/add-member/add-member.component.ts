import { Component } from '@angular/core';
import { GroupsService } from '../../../../services/groups.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Group, User } from '../../../../types';
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
    private route: ActivatedRoute,
  ) {}

  editingGroup?: Group;

  ngOnInit() {
    this.editingGroup = history.state.group;
  }

  async onSubmit(member: User) {
    const groupID = this.route.snapshot.paramMap.get('group-id')!;
    //await this.groupsService.addMemberToGroup(member, groupID);
    this.location.back()
  }
}