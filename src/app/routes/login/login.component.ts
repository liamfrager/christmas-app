import { Component } from "@angular/core";
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { GoogleSignInComponent } from "../../components/forms/buttons/google-sign-in/google-sign-in.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PageHeadingComponent, GoogleSignInComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {}