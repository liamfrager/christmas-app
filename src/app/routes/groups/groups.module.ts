import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupComponent } from './group/group.component';
import { AddMemberComponent } from './group/add-member/add-member.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GroupsComponent },
      { path: 'add-group', component: AddGroupComponent},
      { path: ':group-id', children: [
        { path: '', component: GroupComponent },
        { path: 'add-member', component: AddMemberComponent },
        //{ path: 'edit-group', component: EditGroupComponent },
      ]},
    ]),
  ]
})
export class GroupsModule { }
