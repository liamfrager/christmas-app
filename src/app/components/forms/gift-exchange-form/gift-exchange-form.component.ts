import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../../../types';
import { UserDisplayComponent } from '../../user-display/user-display.component';
import { GiftExchangeService } from '../../../services/gift-exchange.service';

@Component({
  selector: 'app-gift-exchange-form',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDisplayComponent],
  templateUrl: './gift-exchange-form.component.html',
  styleUrl: './gift-exchange-form.component.css'
})
export class GiftExchangeFormComponent {
  constructor(
    private giftExchangeService: GiftExchangeService,
  ) {};
  
  @Input({required: true}) members: Member[] = [];
  @Output() onSetGiftExchangeRestrictions = new EventEmitter();
  @Output() onMappingErrors = new EventEmitter();
  isInclusive = true;
  currentSelectedMember: Member = this.members[0];
  selection: Record<string, Record<string, boolean>> = {};

  ngOnInit() {
    for (const giver of this.members) {
      this.selection[giver.id] = {};
      for (const receiver of this.members) {
        if (giver.id !== receiver.id) {
          this.selection[giver.id][receiver.id] = true;
        }
      }
    }
    this.currentSelectedMember = this.members[0];
  }

  handleGiftExchangeUserSelect(member: Member) {
    this.currentSelectedMember = member;
  }

  toggleSelection(memberID: string) {
    this.selection[this.currentSelectedMember!.id][memberID] = !this.selection[this.currentSelectedMember!.id][memberID]
  }

  onSubmit() {
    const errors = this.giftExchangeService.validateRestrictions(this.selection);
    if (errors.length > 0) {
      this.onMappingErrors.emit(errors);
    } else {
      this.onSetGiftExchangeRestrictions.emit(this.selection);
    }
  }
}