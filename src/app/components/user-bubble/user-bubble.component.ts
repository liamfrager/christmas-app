import { Component } from '@angular/core';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [],
  templateUrl: './user-bubble.component.html',
  styleUrl: './user-bubble.component.css'
})
export class UserBubbleComponent {
  pfp = "";
  name = "";
  icon = "edit";
  clickIcon = () => {};

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
