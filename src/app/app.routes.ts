import { Routes } from '@angular/router';
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
    loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule)
  },
  { path: 'wish-list',
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
    loadChildren: () => import('./routes/secret-santa/secret-santa.module').then(m => m.SecretSantaModule),
  },
  { path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/profile/profile.module').then(m => m.ProfileModule),
  },
  { path: 'settings',
    canActivate: [authGuard],
    component: SettingsComponent,
  },
];