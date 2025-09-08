import { Component } from '@angular/core';
import { GroupsService } from '../../../services/groups.service';
import { Location } from '@angular/common';
import { GroupFormComponent } from "../../../components/forms/group-form/group-form.component";
import { PageHeadingComponent } from '../../../components/page-heading/page-heading.component';
import { NewGroup } from '../../../types';

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [PageHeadingComponent, GroupFormComponent],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.css'
})
export class AddGroupComponent {
  constructor(
    public location: Location,
    private groupsService: GroupsService,
  ) {}

  async onSubmit(newGroup: NewGroup) {
    await this.groupsService.addGroup(newGroup);
    this.location.back()
  }
}
