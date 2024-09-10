import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Friend } from '../../types';

@Component({
  selector: 'app-pfp-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pfp-select.component.html',
  styleUrl: './pfp-select.component.css'
})
export class PfpSelectComponent {
  @Input() friends: Friend[] = [];
  @Output() onSelectFriend =  new EventEmitter<Friend>;
  selectedFriend: Friend | null = null;
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectFriend(friend: Friend) {
    this.selectedFriend = friend;
    this.dropdownOpen = false;
    this.onSelectFriend.emit(this.selectedFriend);
  }
}
