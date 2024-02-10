import { Component, OnInit } from "@angular/core";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, setPersistence, inMemoryPersistence } from "firebase/auth";
import { Router } from "@angular/router"
import { AccountService } from "../../services/account.service.js";
import { FirebaseService } from "../../services/firebase.service.js";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private accountService: AccountService, private firebaseService: FirebaseService, private router: Router) {}

  // Check if user is logged in. If so, reroute.
  ngOnInit() {
    this.firebaseService.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/wish-list']);
      }
    });
  }
  
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
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          if (await this.accountService.isNewUser(user)) {
              this.accountService.createNewUser(user);
          } else {
              this.accountService.getUserInfo(user);
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
}
