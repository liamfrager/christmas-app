import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IconComponent } from "../icon/icon.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent implements OnInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  @Input() triggerText?: string | TemplateRef<any>;
  @Input() triggerIcon?: string;
  @Input() title?: string;
  @Input() body?: string;
  @Input() confirmText?: string;
  @Input() confirmIcon?: string;
  @Input() cancelText?: string;
  @Input() cancelIcon?: string;
  @Output() onConfirm = new EventEmitter()

  ngOnInit() {
    this.confirmIcon = this.confirmIcon ?? this.triggerIcon;
    this.confirmIcon && !this.cancelIcon && (this.cancelIcon = "close");
  }

  @ViewChild('popUp', { read: ElementRef }) popUp!: ElementRef<HTMLDialogElement>;
  showPopUp() {
    this.popUp.nativeElement.showModal();
    setTimeout(() => {
      const input: HTMLInputElement | null =
        this.popUp.nativeElement.querySelector('input[type="text"], input');

      if (input) {
        const len = input.value?.length ?? 0;
        input.focus();
        input.setSelectionRange(len, len);
      }
    });
  }
}
