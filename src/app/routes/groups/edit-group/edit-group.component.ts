import { Component } from '@angular/core';
import { PopUpComponent } from "../../../components/pop-up/pop-up.component";
import { GroupFormComponent } from "../../../components/forms/group-form/group-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { GroupsService } from '../../../services/groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../types';
import { CommonModule, Location } from '@angular/common';
import { AccountService } from '../../../services/account.service';

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
    private accountService: AccountService,
    public location: Location,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  editingGroup?: Group;

  ngOnInit() {
    const userID = this.accountService.currentUserID;
    const groupID = this.route.snapshot.paramMap.get('group-id');
    this.editingGroup = history.state.group;
    if (!this.editingGroup || !this.editingGroup.members.some((m: any) => m.id === userID && m.membershipStatus === 'admin')) {
      this.router.navigate(['groups', groupID]);
    }
  }

  handleFormSubmit(updatedGroup: Group) {
    if (updatedGroup) this.groupsService.updateGroup(this.editingGroup!, updatedGroup);
  }

  async deleteGroup() {
    await this.groupsService.deleteGroup(this.editingGroup!);
    this.router.navigate(['/groups']);
  }
}
