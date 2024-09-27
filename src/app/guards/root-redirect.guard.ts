import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

export const rootRedirectGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router)

  return new Promise<boolean>((resolve) => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);
    if (!isPWA && isMobile) {
      resolve(true);
    } else {
      firebaseService.auth.onAuthStateChanged((user) => {
        if (user) {
          router.navigate(['/wish-list']);
          resolve(false);
        } else {
          router.navigate(['/login']);
        }
        resolve(false);
      });
    }
  });
};