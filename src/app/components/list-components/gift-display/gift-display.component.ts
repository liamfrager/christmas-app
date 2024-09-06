import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Gift } from '../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gift-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-display.component.html',
  styleUrl: './gift-display.component.css'
})
export class GiftDisplayComponent implements OnChanges {
  @Input({required: true}) gift!: Gift;
  @Input({required: true}) checkType!: 'circle' | 'check_circle' | 'error';
  @Output() giftClicked = new EventEmitter();

  checkboxTitle?: string;

  ngOnChanges(): void {
    console.log(this.gift);
    this.checkboxTitle = this.checkType === 'error' ? `This gift has been deleted by ${this.gift.isWishedByUser?.displayName}. It is no longer on their wish list.` : '';
  }

}
