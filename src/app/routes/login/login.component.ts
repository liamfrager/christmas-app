import { Component } from "@angular/core";
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { GoogleSignInComponent } from "../../components/forms/buttons/google-sign-in/google-sign-in.component";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, GoogleSignInComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private route: ActivatedRoute) {}
  accDel: boolean = this.route.snapshot.queryParams['accDel'];
}