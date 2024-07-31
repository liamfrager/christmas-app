import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { User as FirebaseUser } from "firebase/auth";
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseService: FirebaseService, private accountService: AccountService, private router: Router) { }

  // Function to login with Google.
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.firebaseService.auth, provider)
      .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // @ts-ignore: Object is possibly 'null'.
          const token = credential.accessToken;
          // The signed-in user info.
          const user: FirebaseUser = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          if (await this.accountService.isNewUser(user)) {
              this.accountService.createNewUser(user);
          }
          this.router.navigate(['/wish-list'])
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

  logoutUser() {
    signOut(this.firebaseService.auth).then(() => {
      localStorage.removeItem('currentUser')
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Could not logout')
    });
  }
}
