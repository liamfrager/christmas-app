import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { Friend, User } from '../../types';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

@Component({
  selector: 'app-pfp-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PfpSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PfpSelectComponent),
      multi: true
    }
  ],
  templateUrl: './pfp-select.component.html',
  styleUrl: './pfp-select.component.css'
})
export class PfpSelectComponent implements ControlValueAccessor, Validator {
  constructor(private elRef: ElementRef) {}
  @Input() friends: Friend[] = [];
  @Input() _selectedFriend?: User;
  @Input() 
  set selectedFriend(value: User | undefined) {
    this._selectedFriend = value;
    this.onChange(this._selectedFriend);  // Ensure form control is updated if selectedFriend changes
  }
  get selectedFriend(): User | undefined {
    return this._selectedFriend;
  }
  @Output() onSelectFriend =  new EventEmitter<User | undefined>;
  dropdownOpen: boolean = false;

@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (this.dropdownOpen && !this.elRef.nativeElement.contains(target)) {
    this.dropdownOpen = false;
  }
}
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  private onChange = (_: any) => {};
  private onTouched = () => {};

  // This method is called when a friend is selected
  selectFriend(friend: any) {
    this.selectedFriend = friend;
    this.dropdownOpen = false;
    this.onChange(this.selectedFriend);  // Notify the form of the change
    this.onTouched();  // Mark as touched
    this.onSelectFriend.emit(this.selectedFriend);  // Emit the event
  }

  // ControlValueAccessor methods
  writeValue(friend: any): void {
    this.selectedFriend = friend || this.selectedFriend;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Validator method
  validate() {
    return this.selectedFriend ? null : { required: true };
  }
}
