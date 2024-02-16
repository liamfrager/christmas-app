import { Component } from '@angular/core';
import { UserBubbleComponent } from '../user-bubble/user-bubble.component';
import { AccountService } from '../../services/account.service';
import { DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-family-display',
  standalone: true,
  imports: [UserBubbleComponent, CommonModule],
  templateUrl: './family-display.component.html',
  styleUrl: './family-display.component.css'
})
export class FamilyDisplayComponent {
  constructor(private accountService: AccountService) {
    this.accountService.currentUser?.then((value: DocumentData) => {
      this.familyMembers = value['family'];
    })
  }
  familyMembers?: string[];

  goToList(uid: string) {
    console.log("clicked", uid);
  }
}