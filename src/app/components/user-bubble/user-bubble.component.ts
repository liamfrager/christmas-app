import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bubble.component.html',
  styleUrl: './user-bubble.component.css'
})
export class UserBubbleComponent implements OnChanges {
  constructor(private accountService: AccountService) {};
  @Input({required: true}) uid?: string;
  @Input() icon: string = "edit";
  @Output() buttonClicked = new EventEmitter();

  pfp?: string;
  name?: string;

  ngOnChanges() {
    console.log("bubble changes run");
    this.accountService.getUserInfo(this.uid).then(value => {
      console.log(this.uid);
      console.log("value", value);
      this.pfp = value?.['pfp'];
      this.name = value?.['displayName'];
    })
  }

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
