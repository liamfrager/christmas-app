import { Routes } from '@angular/router';
// Login
import { LoginComponent } from './routes/login/login.component';
// Wish List
import { WishListComponent } from './routes/wish-list/wish-list.component';
import { AddGiftComponent } from './routes/wish-list/add-gift/add-gift.component';
// Family
import { FamilyComponent } from './routes/family/family.component';
import { AddFamilyComponent } from './routes/family/add-family/add-family.component';
// Shopping List
import { ShoppingListComponent } from './routes/shopping-list/shopping-list.component';
// Secret Santa
import { SecretSantaComponent } from './routes/secret-santa/secret-santa.component';
// Settings
import { SettingsComponent } from './routes/settings/settings.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'wish-list',
    component: WishListComponent,
  },
  {
    path: 'wish-list/add-gift',
    component: AddGiftComponent,
  },
  {
    path: 'family',
    component: FamilyComponent,
  },
  {
    path: 'family/add-family',
    component: AddFamilyComponent,
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
  },
  {
    path: 'secret-santa',
    component: SecretSantaComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
