import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { WishListComponent } from '../wish-list/wish-list.component';
import { FriendsComponent } from '../friends/friends.component';
import { SettingsComponent } from './settings/settings.component';
import { WishListsComponent } from '../wish-list/wish-lists/wish-lists.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: ':user-id',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'wish-lists',
            children: [
              { path: '', component: WishListsComponent },
              { path: ':list-id', component: WishListComponent },
            ],
          },
          { path: 'friends', component: FriendsComponent },
        ],
      }
    ])
  ]
})
export class ProfileModule { }
