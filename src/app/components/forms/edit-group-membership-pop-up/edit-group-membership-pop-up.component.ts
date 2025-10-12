import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Member } from '../../../types';
import { IconSelectComponent, SelectOption } from "../../icon-select/icon-select.component";
import { CommonModule } from '@angular/common';
import { UserDisplayComponent } from "../../user-display/user-display.component";

@Component({
  selector: 'app-edit-group-membership-pop-up',
  standalone: true,
  imports: [CommonModule, IconSelectComponent, UserDisplayComponent],
  templateUrl: './edit-group-membership-pop-up.component.html',
  styleUrl: './edit-group-membership-pop-up.component.css',
})
export class EditGroupMembershipPopUpComponent {
  @Input({required: true}) member!: Member;
  @Input({required: true}) updatedMembershipStatus!: string;
  @Output() onConfirm = new EventEmitter();
  newUpdatedMembershipStatus: string = this.updatedMembershipStatus;
  selectOptions: SelectOption[] = [];

  ngOnInit() {
    this.newUpdatedMembershipStatus = this.updatedMembershipStatus;
    this.selectOptions = this.member.membershipStatus !== 'pending' ? [
      { value: 'member', label: 'Member', icon: 'person' },
      { value: 'admin', label: 'Admin', icon: 'person_shield' },
    ] : [{ value: 'pending', label: 'Pending', icon: 'schedule' }];
  }

  @ViewChild('popUp') popUp!: ElementRef<HTMLDialogElement>;
  ngOnChanges(changes: any) {
    if (changes['member'] && this.member) {
      queueMicrotask(() => this.popUp?.nativeElement.showModal());
    }
  }
}
