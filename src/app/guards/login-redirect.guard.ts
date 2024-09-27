import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService)
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    firebaseService.auth.onAuthStateChanged((user) => {
      if (user) {
        router.navigate(['/wish-list']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};