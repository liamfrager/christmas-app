import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service.js";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.loginWithGoogle()
  }
}