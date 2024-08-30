import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router"
import { FirebaseService } from "../../services/firebase.service.js";
import { AuthService } from "../../services/auth.service.js";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private firebaseService: FirebaseService, private router: Router) {}

  // Check if user is logged in. If so, reroute.
  ngOnInit() {
    this.firebaseService.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/wish-list']);
      }
    });
  }

  onLogin() {
    this.authService.loginWithGoogle()
  }
}
