import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { AccountService } from '../../../services/account.service';
import { Gift, User } from '../../../types';
import { PopUpComponent } from '../../pop-up/pop-up.component';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent, PopUpComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnChanges, OnInit {
  constructor(private accountService: AccountService) {}
  @Input() gift?: Gift;
  @Input() type?: string;
  @Input() buttonText?: string;
  @Output() onModalClose = new EventEmitter();
  @Output() onButtonClick = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();

  headingButtons = ['close'];
  currentStatus = this.gift?.status;
  currentUser!: User;
  isShown: boolean = false;
  async ngOnInit() {
    this.currentUser = this.accountService.currentUser;
  }
  ngOnChanges() {
    if (this.gift) {
      this.currentStatus = this.gift?.status;
      this.isShown = true;
    }
  }

  /**
   * Hides the modal and triggers `onModalClose` eventEmitter.
   */
  closeModal() {
    this.isShown = false;
    this.onModalClose.emit(true);
  }

  statuses = [
    { name: 'claimed', icon: 'check' },
    { name: 'purchased', icon: 'paid' },
    { name: 'delivered', icon: 'local_shipping' },
    { name: 'wrapped', icon: 'featured_seasonal_and_gifts' },
    { name: 'under tree', icon: 'park'},
  ]
}
