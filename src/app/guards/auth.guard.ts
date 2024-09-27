import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};