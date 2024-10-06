import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { Settings } from '../../types';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { IconComponent } from "../../components/icon/icon.component";
import { AccountService } from '../../services/account.service';
import { PopUpComponent } from "../../components/pop-up/pop-up.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadingComponent, IconComponent, PopUpComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(
    private authService: AuthService,
    public settingsService: SettingsService,
    private accountService: AccountService
  ) {}

  onSettingsChange(name: string, value: any) {
    this.settingsService.updateSettings({[name]: value});
  }

  logoutUser() {
    this.authService.logoutUser();
  }

  deleteAccount() {
    this.accountService.deleteAccount();
    this.authService.logoutUser(true);
  }
}