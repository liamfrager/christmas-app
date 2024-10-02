import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Displays an icon.
 * @Input icon - The name of the [Google Icon](https://fonts.google.com/icons) to be displayed.
 * @Input hover - An indication whether or not the icon should be clickable. Defaults to `true`. Will not grow on hover but can still be clicked on `false`. Clicking is disabled on `null`.
 * @Input size - The font-size of the icon as a string. Defaults to `30px`.
 * @Output iconClicked - Event emitter for when the icon is clicked. Will not emit if `hover == null`.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input({required: true}) icon!: string;
  @Input() hover: boolean | null = true;
  @Input() size: string = '30px'; // Default size.
  @Output() iconClicked = new EventEmitter();
}
