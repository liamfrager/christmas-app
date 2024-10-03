import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  constructor(private router: Router, private accountService: AccountService) {}
  
  isPWA = window.matchMedia('(display-mode: standalone)').matches;
  selectedIndex: number = 0;
  
  ngOnInit(): void {
    // Listen for reroutes and update highlighted menu accordingliy.
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.selectedIndex = this.menu_items.findIndex(item => event.urlAfterRedirects.startsWith(item.route));
      });
  }

  menu_items = [
    {
      route: '/wish-list',
      icon: 'featured_seasonal_and_gifts',
    },
    {
      route: '/friends',
      icon: 'group',
    },
    {
      route: '/shopping-list',
      icon: 'shopping_cart',
    },
    {
      route: '/secret-santa',
      icon: 'crop_square',
    },
    {
      route: '/profile',
      pfp: this.accountService.currentUser.pfp,
    },
  ];

  selectMenu(route: string) {
    this.router.navigate([route])
  }
}