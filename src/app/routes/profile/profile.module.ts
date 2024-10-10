import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { WishListComponent } from '../wish-list/wish-list.component';
import { FriendsComponent } from '../friends/friends.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProfileComponent },
      { path: ':id',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'wish-list', component: WishListComponent },
          { path: 'friends', component: FriendsComponent },
        ],
      }
    ])
  ]
})
export class ProfileModule { }
