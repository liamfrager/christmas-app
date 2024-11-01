import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecretSantaComponent } from './secret-santa.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { SetRestrictionsComponent } from './set-restrictions/set-restrictions.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SecretSantaComponent },
      { path: 'add-group', component: AddGroupComponent},
      { path: 'set-restrictions/:uids', component: SetRestrictionsComponent}
    ]),
  ]
})
export class SecretSantaModule { }
