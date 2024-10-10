import { Component, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from './services/firebase.service';
import { FillerComponent } from "./components/ui/filler/filler.component";
import { SettingsService } from './services/settings.service';
import { Settings } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, FillerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(public firebaseService: FirebaseService, public settingsService: SettingsService, private renderer: Renderer2) {}
  title = 'christmas-app';
  isLoggedIn = localStorage.getItem('isLoggedIn');
  settings!: Settings;
  isPWA = window.matchMedia('(display-mode: standalone)').matches;

  ngOnInit() {
    this.settingsService.settings$.subscribe(
      (settings) => {
        this.settings = settings;
        const themeMetaTag = document.querySelector('meta[name="theme-color"]');
        if (themeMetaTag) {
          if (settings.showHeader){
            this.renderer.setAttribute(themeMetaTag, 'content', '#d64541');
          } else {
            this.renderer.setAttribute(themeMetaTag, 'content', 'cornsilk');
          }
        }
      }
    );
  }
}