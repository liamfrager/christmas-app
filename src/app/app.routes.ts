import { Routes } from '@angular/router';
// Login
import { LoginComponent } from './routes/login/login.component';
// Wish List
import { WishListComponent } from './routes/wish-list/wish-list.component';
import { AddWishGiftComponent } from './routes/wish-list/add-gift/add-wish-gift.component';
// Friends
import { FriendsComponent } from './routes/friends/friends.component';
import { AddFriendComponent } from './routes/friends/add-friend/add-friend.component';
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
  { path: 'wish-list', // NEED TO LAZY LOAD BY MODULE >>> MAKE MODULES FOR EACH TAB
    canActivate: [authGuard],
    loadChildren: () => import('./routes/wish-list/wish-list.module').then(m => m.WishListModule),
  },
  { path: 'friends',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/friends/friends.module').then(m => m.FriendsModule),
  },
  { path: 'shopping-list',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/shopping-list/shopping-list.module').then(m => m.ShoppingListModule),
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
          { path: 'wish-list', loadChildren: () => import('./routes/wish-list/wish-list.module').then(m => m.WishListModule) },
        ],
      }
    ],
  },
  { path: 'settings',
    canActivate: [authGuard],
    component: SettingsComponent,
  },
];