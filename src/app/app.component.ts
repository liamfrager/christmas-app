import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from './services/firebase.service';
import { FillerComponent } from "./components/ui/filler/filler.component";
import { Settings } from './types';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, FillerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public firebaseService: FirebaseService, private settingsService: SettingsService) {}
  title = 'christmas-app';
  isLoggedIn = localStorage.getItem('isLoggedIn');
  settings = this.settingsService.settings;
}