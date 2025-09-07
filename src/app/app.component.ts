import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from './services/firebase.service';
import { SettingsService } from './services/settings.service';
import { Settings } from './types';
import { RefreshService } from './services/refresh.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(public firebaseService: FirebaseService, public settingsService: SettingsService, private renderer: Renderer2) {}
  title = 'christmas-app';
  isLoggedIn = localStorage.getItem('isLoggedIn');
  isLoading: boolean = false;
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
    if (RefreshService.isPWA) {
      const togglePointerEventsOn = 'button, input[type="submit"], .btn, app-icon, app-gift-display, app-user-display, .node'
      document.addEventListener('touchstart', (event) => {
        RefreshService.swipeStartY = event.touches[0].clientY;
      });
      document.addEventListener('touchmove', (event) => {
        // Disable pointer events on buttons to avoid hover highlights
        const buttons: NodeListOf<HTMLElement> = document.querySelectorAll(togglePointerEventsOn);
        buttons.forEach(button => button.style.pointerEvents = 'none');
      });
      document.addEventListener('touchend', (event) => {
        // Re-enable pointer events on buttons
        const buttons: NodeListOf<HTMLElement> = document.querySelectorAll(togglePointerEventsOn);
        buttons.forEach(button => button.style.pointerEvents = 'auto');

        if (window.scrollY < 0) {
          const currentY = event.changedTouches[0].clientY;
          const swipeDistance = currentY - RefreshService.swipeStartY;
          if (swipeDistance > 100) {
            this.isLoading = true;
            RefreshService.triggerRefresh().then(() => {
              this.isLoading = false; // Hide spinner
            });
          }
        }
      });
    }
  }
}