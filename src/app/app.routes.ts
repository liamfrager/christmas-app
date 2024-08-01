import { Routes } from '@angular/router';
// Login
import { LoginComponent } from './routes/login/login.component';
// Wish List
import { WishListComponent } from './routes/wish-list/wish-list.component';
import { AddGiftComponent } from './routes/wish-list/add-gift/add-gift.component';
// Family
import { FamilyComponent } from './routes/family/family.component';
import { AddFamilyComponent } from './routes/family/add-family/add-family.component';
import { FamilyListComponent } from './routes/family/list/list.component';
// Shopping List
import { ShoppingListComponent } from './routes/shopping-list/shopping-list.component';
// Secret Santa
import { SecretSantaComponent } from './routes/secret-santa/secret-santa.component';
// Settings
import { SettingsComponent } from './routes/settings/settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'wish-list', component: WishListComponent, canActivate: [authGuard]},
  { path: 'wish-list/add-gift', component: AddGiftComponent, canActivate: [authGuard]},
  { path: 'family', component: FamilyComponent, canActivate: [authGuard]},
  { path: 'family/add-family', component: AddFamilyComponent, canActivate: [authGuard]},
  { path: 'family/list', component: FamilyListComponent, canActivate: [authGuard]},
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [authGuard]},
  { path: 'secret-santa', component: SecretSantaComponent, canActivate: [authGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
];
