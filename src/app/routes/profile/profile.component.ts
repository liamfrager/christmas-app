import { Component } from '@angular/core';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { AccountService } from '../../services/account.service';
import { UserDisplayComponent } from "../../components/user-display/user-display.component";
import { IconComponent } from "../../components/icon/icon.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PageHeadingComponent, UserDisplayComponent, IconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private accountService: AccountService, private router: Router) {};
  currentUser = this.accountService.currentUser;

  editProfile() {
    console.log('edit profile');
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
