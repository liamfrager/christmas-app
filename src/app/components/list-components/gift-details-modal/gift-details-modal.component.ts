import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnChanges {
  @Input() gift?: any;
  @Output() buttonClicked = new EventEmitter();

  
  headingButtons = ['close']
  ngOnChanges() {
    this.isShown = "show backdrop";
  }

  isShown!: string;
  
  closeModal() {
    this.isShown = "hide backdrop";
  }
}
