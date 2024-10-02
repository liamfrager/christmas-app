import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  daysToChristmas = 0;

  ngOnInit() {
    this.daysToChristmas = this.findDaysToChristmas();
  }

  findDaysToChristmas() {
    const dayOfYear = (date: Date) =>
      Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
          1000 /
          60 /
          60 /
          24
      );
    let today = new Date();
    let christmas = new Date(`12/25/${today.getFullYear()}`);
    return dayOfYear(christmas) - dayOfYear(today);
  }
}
