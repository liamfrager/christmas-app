import { Component } from "@angular/core";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth";
import { AccountService } from "../../services/account.service.js";
import { FirebaseService } from "../../services/firebase.service.js";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) {
  }
  loginWithGoogle() {
    console.log(browserSessionPersistence);
    setPersistence(this.firebaseService.auth, browserSessionPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        const provider = new GoogleAuthProvider();
        signInWithPopup(this.firebaseService.auth, provider)
          .then(async (result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential = GoogleAuthProvider.credentialFromResult(result);
              // @ts-ignore: Object is possibly 'null'.
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              // IdP data available using getAdditionalUserInfo(result)
              // ...
              if (await this.accountService.isNewUser(user)) {
                  this.accountService.createNewUser(user);
              } else {
                  this.accountService.getUserInfo(user);
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
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });
    onAuthStateChanged(this.firebaseService.auth, user => {
      // Check for user status
    });
  }
}
