import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent {
  @Input({required: true}) buttonText!: string;
  @Input({required: true}) title!: string;
  @Input({required: true}) body!: string;
  @Input() confirmText: string = 'Confirm';
  @Output() onConfirm = new EventEmitter()
}
