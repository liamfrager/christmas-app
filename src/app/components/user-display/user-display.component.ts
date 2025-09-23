import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../types';
import { Router } from '@angular/router';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './user-display.component.html',
  styleUrl: './user-display.component.css'
})
export class UserDisplayComponent {
  constructor(private router: Router) {};
  @Input({required: true}) user!: User;
  @Input() onClick: (() => void) | null = this.goToProfile;
  @Input() icon: string | null = null;
  @Input() isInline?: boolean = false;

  /**
   * Reroutes the webpage to the displayed user's profile.
   */
  goToProfile() {
    this.router.navigate(['profile', this.user.id]);
  }

  /**
   * Reroutes the webpage to the displayed user's wish-lists.
   */
  goToLists() {
    this.router.navigate(['profile', this.user.id, 'wish-lists']);
  }
  
  /**
   * Handles if onClick is null.
   */
  doOnClick() {
    if (this.onClick === null) return;
    this.onClick();
  }
}
