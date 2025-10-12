import { Component } from '@angular/core';
import { PopUpComponent } from "../../../components/pop-up/pop-up.component";
import { GroupFormComponent } from "../../../components/forms/group-form/group-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { GroupsService } from '../../../services/groups.service';
import { Router } from '@angular/router';
import { Group } from '../../../types';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [CommonModule, PopUpComponent, GroupFormComponent, PageHeadingComponent],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.css'
})
export class EditGroupComponent {
  constructor(
    private groupsService: GroupsService,
    public location: Location,
    private router: Router,
  ) {}

  editingGroup?: Group;

  ngOnInit() {
    this.editingGroup = history.state.group;
  }

  handleFormSubmit(updatedGroup: Group) {
    if (updatedGroup) this.groupsService.updateGroup(this.editingGroup!, updatedGroup);
  }

  async deleteGroup() {
    await this.groupsService.deleteGroup(this.editingGroup!);
    this.router.navigate(['/groups']);
  }
}
