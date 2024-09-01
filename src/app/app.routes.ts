import { Routes } from '@angular/router';
// Login
import { LoginComponent } from './routes/login/login.component';
// Wish List
import { WishListComponent } from './routes/wish-list/wish-list.component';
import { AddWishGiftComponent } from './routes/wish-list/add-gift/add-wish-gift.component';
// Friends
import { FriendsComponent } from './routes/friends/friends.component';
import { AddFriendComponent } from './routes/friends/add-friend/add-friend.component';
import { FriendsListComponent } from './routes/friends/list/list.component';
// Shopping List
import { ShoppingListComponent } from './routes/shopping-list/shopping-list.component';
import { AddShoppingGiftComponent } from './routes/shopping-list/add-gift/add-shopping-gift.component';
// Secret Santa
import { SecretSantaComponent } from './routes/secret-santa/secret-santa.component';
// Settings
import { SettingsComponent } from './routes/settings/settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'wish-list', component: WishListComponent, canActivate: [authGuard]},
  { path: 'wish-list/add-gift', component: AddWishGiftComponent, canActivate: [authGuard]},
  { path: 'friends', component: FriendsComponent, canActivate: [authGuard]},
  { path: 'friends/add-friend', component: AddFriendComponent, canActivate: [authGuard]},
  { path: 'friends/list', component: FriendsListComponent, canActivate: [authGuard]},
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [authGuard]},
  { path: 'shopping-list/add-gift', component: AddShoppingGiftComponent, canActivate: [authGuard]},
  { path: 'secret-santa', component: SecretSantaComponent, canActivate: [authGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
];
