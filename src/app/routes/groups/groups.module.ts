import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupComponent } from './group/group.component';
import { MembershipComponent } from './group/membership/membership.component';
import { GroupRequestsComponent } from './group-requests/group-requests.component';
import { EditGroupComponent } from './edit-group/edit-group.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GroupsComponent },
      { path: 'requests', component: GroupRequestsComponent },
      { path: 'add-group', component: AddGroupComponent},
      { path: ':group-id', children: [
        { path: '', component: GroupComponent },
        { path: 'membership', component: MembershipComponent },
        { path: 'edit-group', component: EditGroupComponent },
      ]},
    ]),
  ]
})
export class GroupsModule { }
