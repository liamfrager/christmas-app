import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent {
  @Input() gift: any;
  @Output() closeModal = new EventEmitter()
  @Output() claimGift = new EventEmitter()
}
