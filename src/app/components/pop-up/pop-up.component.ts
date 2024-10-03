import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent {
  @Input({required: true}) buttonText!: string | TemplateRef<any>;
  @Input() buttonIcon!: string;
  @Input({required: true}) title!: string;
  @Input({required: true}) body!: string;
  @Input() confirmText: string = 'Confirm';
  @Output() onConfirm = new EventEmitter()
}
