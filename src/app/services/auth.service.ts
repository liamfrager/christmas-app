import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { User as FirebaseUser } from "firebase/auth";
import { AccountService } from './account.service';
import { User } from '../types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService, private router: Router) {
    this.firebaseService.auth.onAuthStateChanged(user => {
      this.loggedIn.next(!!user);
    });
  }
  private loggedIn = new BehaviorSubject<boolean> (!!localStorage.getItem('currentUser'));
  public isLoggedIn$ = this.loggedIn.asObservable();

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
          this.loginUser(newUser);
        } else {
          this.loginUser(user);
        }
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

  loginUser(user: User) {
    this.loggedIn.next(true);
    localStorage.setItem('currentUser', JSON.stringify(user))
    this.router.navigate(['/wish-list'])
  }

  logoutUser(): void {
    signOut(this.firebaseService.auth).then(() => {
      this.loggedIn.next(false);
      localStorage.removeItem('currentUser')
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Could not logout')
    });
  }
}