import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { IconComponent } from '../icon/icon.component';
import { User } from '../../types';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './user-display.component.html',
  styleUrl: './user-display.component.css'
})
export class UserDisplayComponent implements OnChanges {
  constructor(private accountService: AccountService) {};
  @Input({required: true}) uid!: string;
  @Input() icon: string = "edit";
  @Output() buttonClicked = new EventEmitter();

  user?: User;

  async ngOnChanges() {
    this.user = await this.accountService.getUserInfo(this.uid)
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
