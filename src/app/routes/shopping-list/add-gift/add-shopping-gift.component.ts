import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-shopping-gift',
  standalone: true,
  imports: [GiftFormComponent, PageHeadingComponent],
  templateUrl: './add-shopping-gift.component.html',
  styleUrl: './add-shopping-gift.component.css'
})
export class AddShoppingGiftComponent {
  constructor (private router: Router) {}
  
  reroute() {
    this.router.navigate(['/shopping-list']);
  }
}
