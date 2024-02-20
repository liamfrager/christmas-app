import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input({required: true}) icon!: string;
  @Output() iconClicked = new EventEmitter();
}
