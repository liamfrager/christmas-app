import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FriendsComponent },
      { path: 'requests', component: FriendRequestsComponent },
      { path: 'add-friend', component: AddFriendComponent },
    ]),
  ]
})
export class FriendsModule { }
