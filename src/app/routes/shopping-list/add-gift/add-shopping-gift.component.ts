import { Component } from '@angular/core';
import { GiftFormComponent } from "../../../components/forms/gift-form/gift-form.component";

@Component({
  selector: 'app-add-shopping-gift',
  standalone: true,
  imports: [GiftFormComponent],
  templateUrl: './add-shopping-gift.component.html',
  styleUrl: './add-shopping-gift.component.css'
})
export class AddShoppingGiftComponent {
}
