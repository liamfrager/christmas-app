import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";


@Component({
  selector: 'app-add-wish-gift',
  standalone: true,
  imports: [GiftFormComponent],
  templateUrl: './add-wish-gift.component.html',
  styleUrl: './add-wish-gift.component.css'
})
export class AddWishGiftComponent {
  constructor() {};
}
