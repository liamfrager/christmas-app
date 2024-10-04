import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup, signOut } from 'firebase/auth';
import { User as FirebaseUser } from "firebase/auth";
import { AccountService } from './account.service';
import { User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService, private router: Router) {}

  // Function to login with Google.
  loginWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    signInWithPopup(this.firebaseService.auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // @ts-ignore: Object is possibly 'null'.
        const token = credential.accessToken;
        // The signed-in user info.
        const fbUser: FirebaseUser = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const user = await this.accountService.getUserInfo(fbUser.uid);
        if (!user) {
          const newUser = this.accountService.createNewUser(fbUser);
        }
        this.loginUser();
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(errorMessage);
        // ...
    });
  }

  loginUser() {
    setPersistence(this.firebaseService.auth, browserLocalPersistence)
    .then(async () => {
      this.router.navigate(['/wish-list']);
      localStorage.setItem('isLoggedIn', 'true');
      const currentUser: User | undefined = await this.accountService.getUserInfo(this.accountService.currentUserID!);
      if (currentUser) {
        localStorage.setItem('displayName', currentUser.displayName);
        if (currentUser.mood)
          localStorage.setItem('mood', currentUser.mood);
        if (currentUser.bio)
          localStorage.setItem('bio', currentUser.bio);
      }
      const settings = await this.accountService.getSettings();
      localStorage.setItem('settings', JSON.stringify(settings));
    })
    .catch((error) => {
      console.error('Error setting persistence', error);
    });
  }

  logoutUser(): void {
    signOut(this.firebaseService.auth).then(() => {
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Could not logout');
    });
  }
}