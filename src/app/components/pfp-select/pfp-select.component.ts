import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../types';

@Component({
  selector: 'app-pfp-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pfp-select.component.html',
  styleUrl: './pfp-select.component.css'
})
export class PfpSelectComponent {
  @Input() users: User[] = [];
  selectedUser: User | null = null;
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.dropdownOpen = false;
  }
}
