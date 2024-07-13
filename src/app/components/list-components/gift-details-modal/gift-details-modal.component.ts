import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { AccountService } from '../../../services/account.service';
import { FirebaseService } from '../../../services/firebase.service';
import { doc, updateDoc } from 'firebase/firestore';
import { User } from '../../../types';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnChanges, OnInit{
await: any;
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) {}
  @Input() gift?: any;
  @Input() type?: string;
  @Output() onGiftClaim = new EventEmitter();
  @Output() onGiftEdit = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();

  headingButtons = ['close'];
  isShown = false;
  currentStatus = this.gift?.status;
  currentUser!: User;
  async ngOnInit() {
    this.currentUser = await this.accountService.currentUser;
  }
  ngOnChanges() {
    console.log(this.currentUser.id)
    console.log(this.gift)
    this.isShown = true;
    this.currentStatus = this.gift?.status;
  }
  closeModal() {
    this.isShown = false;
    // TODO: visuals are not updating before statusUpdated is emiting. directly update classlist rather than updating "isShown"?
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
