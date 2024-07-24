import { Component } from '@angular/core';
import { UserBubbleComponent } from '../user-bubble/user-bubble.component';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-display',
  standalone: true,
  imports: [UserBubbleComponent, CommonModule],
  templateUrl: './family-display.component.html',
  styleUrl: './family-display.component.css'
})
export class FamilyDisplayComponent {
  constructor(private accountService: AccountService, private router: Router) {
    this.familyMembers = this.accountService.currentUser.friends
  }
  familyMembers?: string[];

  goToList(uid: string) {
    this.router.navigate(['/family/list'], {queryParams: {uid: uid}});
  }
}