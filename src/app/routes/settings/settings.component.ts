import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { Settings } from '../../types';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadingComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}
  settings!: Settings;

  async ngOnInit() {
    const userSettings = await this.accountService.getSettings();
    this.settings = {...this.accountService.defaultSettings, ...userSettings}
  }

  onSettingsChange(setting: string, value: any) {
    this.accountService.updateSettings({[setting]: value});
  }

  logoutUser() {
    this.authService.logoutUser();
  }

}
