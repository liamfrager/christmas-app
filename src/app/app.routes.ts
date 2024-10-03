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
import { loginRedirectGuard } from './guards/login-redirect.guard';
import { DownloadComponent } from './routes/download/download.component';
import { ProfileComponent } from './routes/profile/profile.component';

export const routes: Routes = [
  { path: '',
    canActivate: [rootRedirectGuard],
    component: DownloadComponent,
  },
  { path: 'login',
    canActivate: [loginRedirectGuard],
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
  { path: 'profile',
    canActivate: [authGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: ':id',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'wish-list', component: WishListComponent },
        ],
      }
    ],
  },
  { path: 'settings',
    canActivate: [authGuard],
    component: SettingsComponent,
  },
];