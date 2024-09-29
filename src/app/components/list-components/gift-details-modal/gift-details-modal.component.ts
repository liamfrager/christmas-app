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
  imports: [CommonModule, PageHeadingComponent, IconComponent, PopUpComponent, GiftFormComponent, IconComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent {
  @Input() gift?: Gift;
  @Input() type?: string;
  @Input() buttonType!: 'claim' | 'unclaim' | 'claimed' | 'edit';
  @Input() isShown: boolean = false;
  @Output() onModalClose = new EventEmitter();
  @Output() onButtonClick = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();

  headingButtons = ['close'];
  currentStatus = this.gift?.status;
  editingGift: boolean = false;
  public get buttonText() : string {
    return this.buttonType === 'claimed' ? 'This gift has already been claimed.' : this.buttonType.charAt(0).toUpperCase() + this.buttonType.slice(1) + ' gift';
  }
  
  buttonClick(event: any) {
    if (event === 'edit') {
      this.editingGift = true;
    } else {
      this.editingGift = false;
      this.onButtonClick.emit(event);
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
