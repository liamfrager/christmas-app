import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { AccountService } from '../../../services/account.service';
import { Gift, User } from '../../../types';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnChanges, OnInit{
await: any;
  constructor(private accountService: AccountService) {}
  @Input() gift?: Gift;
  @Input() type?: string;
  @Output() onModalClose = new EventEmitter();
  @Output() onGiftClaim = new EventEmitter();
  @Output() onGiftEdit = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();
  @Output() onGiftDelete = new EventEmitter();

  headingButtons = ['close'];
  currentStatus = this.gift?.status;
  currentUser!: User;
  isShown: boolean = false;
  async ngOnInit() {
    this.currentUser = await this.accountService.currentUser;
  }
  ngOnChanges() {
    this.currentStatus = this.gift?.status;
    this.isShown = true;
  }
  closeModal() {
    this.isShown = false;
    this.onModalClose.emit(true)
  }


  statuses = [
    {
      name: 'claimed',
      icon: 'check'
    },{
      name: 'bought',
      icon: 'paid'
    }, {
      name: 'ordered',
      icon: 'local_shipping'
    }, {
      name: 'wrapped',
      icon: 'featured_seasonal_and_gifts'
    }, {
      name: 'under tree',
      icon: 'park'
    }]
}
