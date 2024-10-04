import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { Settings } from '../../types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadingComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
  ) {}
  settings: Settings = this.settingsService.settings;

  onSettingsChange(setting: string, value: any) {
    this.settingsService.updateSettings({[setting]: value});
  }

  logoutUser() {
    this.authService.logoutUser();
  }

}
