import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input({required: true}) icon!: string;
  @Input() hover: boolean = true;
  @Input() size: string = '30px'; // Default size.
  @Output() iconClicked = new EventEmitter();
}
