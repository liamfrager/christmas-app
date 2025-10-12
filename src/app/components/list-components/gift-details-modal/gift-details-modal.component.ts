import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { Gift } from '../../../types';
import { PopUpComponent } from '../../pop-up/pop-up.component';
import { GiftFormComponent } from "../../forms/gift-form/gift-form.component";
import { FillerComponent } from "../../ui/filler/filler.component";
import { ImagePreviewComponent } from "../../image-preview/image-preview.component";

@Component({
  selector: 'app-gift-details-modal',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent, PopUpComponent, GiftFormComponent, IconComponent, FillerComponent, ImagePreviewComponent],
  templateUrl: './gift-details-modal.component.html',
  styleUrl: './gift-details-modal.component.css'
})
export class GiftDetailsModalComponent implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  @Input() gift?: Gift;
  @Input() type?: string;
  @Input() buttonType!: 'claim' | 'unclaim' | 'claimed' | 'edit';
  @Input() isShown: boolean = false;
  @Input() errors: string[] = [];
  @Output() onModalClose = new EventEmitter();
  @Output() onButtonClick = new EventEmitter();
  @Output() onStatusUpdated = new EventEmitter();

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

  getIcon() {
    const icons = {
      'claim': 'add_shopping_cart',
      'unclaim': 'remove_shopping_cart',
      'claimed': '',
      'edit': 'edit',
    }
    return icons[this.buttonType];
  }

  statuses = [
    { name: 'claimed', icon: 'check' },
    { name: 'purchased', icon: 'paid' },
    { name: 'shipped', icon: 'local_shipping' },
    { name: 'delivered', icon: 'package_2' },
    { name: 'wrapped', icon: 'featured_seasonal_and_gifts' },
    { name: 'under tree', icon: 'park'},
  ]

  ngOnInit(): void {
    if (this.gift?.isDeleted) this.errors.push(`This gift has been deleted by ${this.gift.isWishedByUser.displayName}. It is no longer on their wish list.`)

    const modal = this.el.nativeElement.querySelector('.backdrop');
    let initialTouchY = 0;

    // Listen for touchstart to capture the initial Y position
    this.renderer.listen(modal, 'touchstart', (event: TouchEvent) => {
      initialTouchY = event.touches[0].clientY;
    });

    // Add wheel event listener to prevent scroll overflow
    this.renderer.listen(modal, 'wheel', (event: WheelEvent) => {
      const scrollTop = modal.scrollTop;
      const scrollHeight = modal.scrollHeight;
      const offsetHeight = modal.offsetHeight;
      const scrollBottom = scrollHeight - offsetHeight - scrollTop;

      if ((scrollTop === 0 && event.deltaY < 0) || (scrollBottom <= 0 && event.deltaY > 0)) {
        event.preventDefault();
      }
    });

    // Add touchmove listener for mobile devices
    this.renderer.listen(modal, 'touchmove', (event: TouchEvent) => {
      const scrollTop = modal.scrollTop;
      const scrollHeight = modal.scrollHeight;
      const offsetHeight = modal.offsetHeight;
      const scrollBottom = scrollHeight - offsetHeight - scrollTop;

      if ((scrollTop === 0 && event.touches[0].clientY > initialTouchY) || (scrollBottom <= 0 && event.touches[0].clientY < initialTouchY)) {
        event.preventDefault();
      }
    });
  }
}