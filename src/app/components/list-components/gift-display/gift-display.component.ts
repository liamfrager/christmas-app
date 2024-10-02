import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Gift } from '../../../types';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../icon/icon.component";
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-gift-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './gift-display.component.html',
  styleUrl: './gift-display.component.css'
})
export class GiftDisplayComponent implements OnChanges {
  constructor(private accountService: AccountService) {};
  @Input({required: true}) gift!: Gift;
  @Input({required: true}) checkType!: 'circle' | 'check_circle' | 'paid' | 'local_shipping' | 'featured_seasonal_and_gifts' | 'park' | 'error';
  @Output() giftClicked = new EventEmitter();

  checkboxTitle?: string;
  get claimedByUser(): string {
    if (this.gift.isClaimedByID === this.accountService.currentUserID)
      return 'isClaimedByUser';
    return 'false';
  }

  ngOnChanges(): void {
    this.checkboxTitle = this.checkType === 'error' ? `This gift has been deleted by ${this.gift.isWishedByUser.displayName}. It is no longer on their wish list.` : '';
  }
}
