import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { AccountService } from '../../../services/account.service';
import { FirebaseService } from '../../../services/firebase.service';
import { doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnChanges, OnDestroy{
  constructor(private accountService: AccountService, private firebaseService: FirebaseService) {};
  @Input() gift?: any;
  @Input() type?: string;
  @Output() buttonClicked = new EventEmitter();
  @Output() statusUpdated = new EventEmitter();

  headingButtons = ['close']
  currentStatus = this.gift?.status
  isShown!: string;
  ngOnChanges() {
    this.isShown = "show backdrop";
    this.currentStatus = this.gift?.status
  }
  closeModal() {
    this.isShown = "hide backdrop";
    this.statusUpdated.emit(this.currentStatus)
  }

  ngOnDestroy(): void {
    this.statusUpdated.emit(this.currentStatus)
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
