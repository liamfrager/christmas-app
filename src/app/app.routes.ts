import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { WishListComponent } from './routes/wish-list/wish-list.component';
import { FamilyComponent } from './routes/family/family.component';
import { ShoppingListComponent } from './routes/shopping-list/shopping-list.component';
import { SecretSantaComponent } from './routes/secret-santa/secret-santa.component';
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
    path: 'family',
    component: FamilyComponent,
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
