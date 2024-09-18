import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { AccountService } from '../../../services/account.service';
import { Gift, NewGift, User } from '../../../types';
import { PopUpComponent } from '../../pop-up/pop-up.component';
import { GiftFormComponent } from "../../forms/gift-form/gift-form.component";

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent, PopUpComponent, GiftFormComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent {
  constructor(private accountService: AccountService) {}
  @Input() gift?: Gift;
  @Input() type?: string;
  @Input() buttonText?: string;
  @Input() isShown: boolean = false;
  @Output() onModalClose = new EventEmitter();
  @Output() onButtonClick = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();

  headingButtons = ['close'];
  currentStatus = this.gift?.status;
  currentUser: User = this.accountService.currentUser;
  editingGift: boolean = false;

  buttonClick(event?: any) {
    console.log(event);
    if (event) { // If gift has been edited
      this.editingGift = false;
      this.onButtonClick.emit(event);
    } else {
      if (this.buttonText === 'Edit gift' && this.editingGift == false) {
        this.editingGift = true;
      } else {
        this.editingGift = false;
        this.onButtonClick.emit();
      }
    }
  }

  statuses = [
    { name: 'claimed', icon: 'check' },
    { name: 'purchased', icon: 'paid' },
    { name: 'delivered', icon: 'local_shipping' },
    { name: 'wrapped', icon: 'featured_seasonal_and_gifts' },
    { name: 'under tree', icon: 'park'},
  ]
}
