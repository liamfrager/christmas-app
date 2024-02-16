import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gift-display',
  standalone: true,
  imports: [],
  templateUrl: './gift-display.component.html',
  styleUrl: './gift-display.component.css'
})
export class GiftDisplayComponent {
  @Input() gift?: any;
  @Output() giftClicked = new EventEmitter();
}
