import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FriendsComponent },
      { path: 'requests', component: FriendRequestsComponent },
      { path: 'search', component: UserSearchComponent },
    ]),
  ]
})
export class FriendsModule { }
