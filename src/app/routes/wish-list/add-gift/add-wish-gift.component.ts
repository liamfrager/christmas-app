import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-wish-gift',
  standalone: true,
  imports: [GiftFormComponent, PageHeadingComponent],
  templateUrl: './add-wish-gift.component.html',
  styleUrl: './add-wish-gift.component.css'
})
export class AddWishGiftComponent {
  constructor(private router: Router) {}

  reroute() {
    this.router.navigate(['/wish-list']);
  }
}
