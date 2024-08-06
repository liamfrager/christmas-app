import { Component } from '@angular/core';
import { FriendsDisplayComponent } from '../../components/friends-display/friends-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [FriendsDisplayComponent, PageHeadingComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {
  constructor(private router: Router) {};
  headingButtons = ['filter_list', 'person_add'];

  onHeadingIconClick(e: any) {
    switch (e) {
      case 'filter_list':
        // TODO: add sorting capabilities
        console.log('filter')
        break;
      case 'person_add':
        this.router.navigate(['/friends/add-friend']);
        break;
      default:
        break;
    }
  }
}
