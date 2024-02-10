import { Component } from '@angular/core';
import { UserBubbleComponent } from '../../../components/user-bubble/user-bubble.component';

@Component({
  selector: 'app-add-family',
  standalone: true,
  imports: [UserBubbleComponent],
  templateUrl: './add-family.component.html',
  styleUrl: './add-family.component.css'
})
export class AddFamilyComponent {

}
