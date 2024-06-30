import { Component } from '@angular/core';
import { FamilyDisplayComponent } from '../../components/family-display/family-display.component';
import { PageHeadingComponent } from '../../components/page-heading/page-heading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [FamilyDisplayComponent, PageHeadingComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})
export class FamilyComponent {
  constructor(private router: Router) {};
  headingButtons = ['filter_list', 'person_add'];

  onHeadingIconClick(e: any) {
    switch (e) {
      case 'filter_list':
        // TODO: add sorting capabilities
        console.log('filter')
        break;
      case 'person_add':
        this.router.navigate(['/family/add-family']);
        break;
      default:
        break;
    }
  }
}
