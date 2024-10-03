import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { User } from '../../types';
import { Router } from '@angular/router';

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
  @Input() iconActions?: Map<string, () => void> = new Map();
  @Input() onClick: (() => void) | null = this.goToProfile;

  /**
   * Reroutes the webpage to the displayed user's profile.
   */
  goToProfile() {
    this.router.navigate([`/profile/${this.user.id}`]);
  }
  
  /**
   * Handles if onClick is null.
   */
  doOnClick() {
    if (this.onClick === null) return;
    this.onClick();
  }
}
