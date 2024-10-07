import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { AddFriendComponent } from './add-friend/add-friend.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FriendsComponent },
      { path: 'add-friend', component: AddFriendComponent },
    ]),
  ]
})
export class FriendsModule { }
