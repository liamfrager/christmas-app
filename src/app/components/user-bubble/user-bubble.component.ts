import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bubble.component.html',
  styleUrl: './user-bubble.component.css'
})
export class UserBubbleComponent {
  @Input() pfp?: string;
  @Input() name?: string;
  @Input() icon: string = "edit";
  @Output() buttonClicked = new EventEmitter();

  runIcon() {
      switch (this.icon) {
          case "edit":
              break;
          case "person_add":
              this.icon = "check"
              break;
          default:
              break;
      }
  }
}
