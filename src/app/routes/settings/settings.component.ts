import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PageHeadingComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(
    private authService: AuthService,
  ) {}

  logoutUser() {
    this.authService.logoutUser();
  }

}
