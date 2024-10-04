import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishListComponent } from './wish-list.component';
import { AddWishGiftComponent } from './add-gift/add-wish-gift.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: WishListComponent },
      { path: 'add-gift', component: AddWishGiftComponent },
    ]),
  ]
})
export class WishListModule { }
