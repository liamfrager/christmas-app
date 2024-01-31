import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  menu_items = [
    {
      route: '/wish-list',
      icon: 'featured_seasonal_and_gifts',
    },
    {
      route: '/family',
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
      route: '/settings',
      icon: 'settings',
    },
  ];
  selectedIndex = 0;

  selectMenu(index: number) {
    this.selectedIndex = index;
  }
}
