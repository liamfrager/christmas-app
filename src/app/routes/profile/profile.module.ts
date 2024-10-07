import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProfileComponent },
      { path: ':id',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'wish-list', loadChildren: () => import('../wish-list/wish-list.module').then(m => m.WishListModule) },
        ],
      }
    ])
  ]
})
export class ProfileModule { }
