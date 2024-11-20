import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishListComponent } from './wish-list/wish-list.component';
import { AddWishGiftComponent } from './wish-list/add-gift/add-wish-gift.component';
import { WishListsComponent } from './wish-lists/wish-lists.component';
import { AddWishListComponent } from './wish-lists/add-wish-list/add-wish-list.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: WishListsComponent },
      { path: 'add-list', component: AddWishListComponent },
      { path: ':list-id', children: [
        { path: '', component: WishListComponent },
        { path: 'add-gift', component: AddWishGiftComponent },
      ]},
    ]),
  ]
})
export class WishListModule { }
