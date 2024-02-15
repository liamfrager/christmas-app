import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bubble.component.html',
  styleUrl: './user-bubble.component.css'
})
export class UserBubbleComponent {
  @Input() pfp: string | undefined;
  @Input() name: string | undefined;
  @Input() icon: string | undefined = "edit";
  @Input() args: any;
  @Input() func!: (args: any) => void;;

  onClick = () => {
    this.func(this.args);
    // this.runIcon();
  };

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
