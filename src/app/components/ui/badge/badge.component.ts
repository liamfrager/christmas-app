import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent {
  @Input() badgeValue: number | string | boolean = false;
  @Input() color: string = '#d64541';
  @Input() size: string = '.8em';

  ngOnInit() {
    this.badgeValue = this.badgeValue ?? false;
  }
}