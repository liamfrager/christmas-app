import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { AddShoppingGiftComponent } from './add-gift/add-shopping-gift.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent },
      { path: 'add-gift', component: AddShoppingGiftComponent },
    ]),
  ]
})
export class ShoppingListModule { }
