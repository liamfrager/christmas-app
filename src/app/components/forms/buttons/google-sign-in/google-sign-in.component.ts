import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-google-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './google-sign-in.component.html',
  styleUrl: './google-sign-in.component.css'
})
export class GoogleSignInComponent {
  constructor(private authService: AuthService) {};

  onClick() {
    this.authService.loginWithGoogle()
  }
}
