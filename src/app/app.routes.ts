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
// Guards
import { authGuard } from './guards/auth.guard';
import { rootRedirectGuard } from './guards/root-redirect.guard';

export const routes: Routes = [
  { path: '',
    canActivate: [rootRedirectGuard],
    component: LoginComponent,
  },
  { path: 'login',
    component: LoginComponent,
  },
  { path: 'wish-list',
    canActivate: [authGuard],
    children: [
      { path: '', component: WishListComponent },
      { path: 'add-gift', component: AddWishGiftComponent },
    ],
  },
  { path: 'friends',
    canActivate: [authGuard],
    children: [
      { path: '', component: FriendsComponent },
      { path: 'add-friend', component: AddFriendComponent },
      { path: 'list', component: FriendsListComponent },
    ],
  },
  { path: 'shopping-list',
    canActivate: [authGuard],
    children: [
      { path: '', component: ShoppingListComponent },
      { path: 'add-gift', component: AddShoppingGiftComponent },
    ],
  },
  { path: 'secret-santa',
    canActivate: [authGuard],
    component: SecretSantaComponent,
  },
  { path: 'settings',
    canActivate: [authGuard],
    component: SettingsComponent,
  },
];
