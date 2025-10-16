import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { IconComponent } from "../icon/icon.component";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string; // Google Material icon name
}

@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.css'],
})
export class IconSelectComponent {
  @Input({required: true}) options: SelectOption[] = [];
  @Input() selectedValue?: string;
  @Output() selectedValueChange = new EventEmitter<string>();

  isOpen = false;

  toggleSelect() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectOption) {
    this.selectedValue = option.value;
    this.selectedValueChange.emit(option.value);
    this.isOpen = false;
  }

  get selectedOption(): SelectOption | undefined {
    return this.options.find(o => o.value === this.selectedValue);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = document.querySelector('.dropdown');
    
    if (this.isOpen && dropdownElement && !dropdownElement.contains(target)) {
      this.isOpen = false;
    }
  }
}