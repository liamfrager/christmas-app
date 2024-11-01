import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../../types';
import { AccountService } from '../../../services/account.service';
import { FriendsDisplayComponent } from '../../../components/friends-display/friends-display.component';
import { PageHeadingComponent } from '../../../components/page-heading/page-heading.component';

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [FriendsDisplayComponent, PageHeadingComponent, CommonModule],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.css'
})
export class AddGroupComponent {
  constructor(public location: Location, private accountService: AccountService) {}

  newGroup: User[] = []
  newGroupDisplay: string[] = [];
  user?: User;
  async ngOnInit() {
    this.user = this.accountService.currentUser;
  }

  addToGroup(user?: User) {
    return (user?: User) => {
      if(user && !this.newGroup.includes(user)) {
        this.newGroup.push(user);
        this.newGroupDisplay = this.newGroup.map(user => user.displayName);
      }
    }
  }
}
