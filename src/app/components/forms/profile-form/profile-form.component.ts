import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserProfile } from '../../../types';
import { AccountService } from '../../../services/account.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [FormsModule, PickerComponent],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {
onEmojiClick($event: Event) {
throw new Error('Method not implemented.');
}
  constructor(private accountService: AccountService) {};
  @Input() user!: UserProfile;
  @Output() onFormSubmit =  new EventEmitter();

  ngOnInit() {
    if (!this.user)
      this.user = this.accountService.currentUser;
  }

  // Emoji regex that detects most emoji (using Unicode emoji ranges)
  private emojiRegex = /^(?:[\u2700-\u27BF]|[\u1F600-\u1F64F]|\uD83C[\uDDE6-\uDDFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF])$/;

  // Custom emoji validation method
  validateEmoji(input: any) {
    const value = input.value;
    if (!value || !this.emojiRegex.test(value) || value.length !== 1) {
      input.control.setErrors({ emojiInvalid: true });
    } else {
      input.control.setErrors(null);
    }
  }

  onSubmit(form: NgForm) {
    this.onFormSubmit.emit(form)
  }
}
