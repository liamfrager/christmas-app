import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { AddGroupComponent } from './add-group/add-group.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GroupsComponent },
      { path: 'add-group', component: AddGroupComponent}
    ]),
  ]
})
export class GroupsModule { }
