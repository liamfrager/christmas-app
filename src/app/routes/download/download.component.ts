import { Component } from '@angular/core';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  constructor(private router: Router) {};
  userOS = this.getOS();

  getOS() {
    if (/android/i.test(window.navigator.userAgent)) {
      return 'Android';
    } else if (/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream) {
      return 'iOS';
    } else {
      return 'Desktop'
    }
  }

  continueInBrowser() {
    this.router.navigate(['/login']);
  }
}
