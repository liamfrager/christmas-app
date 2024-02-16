import { Component } from '@angular/core';
import { FamilyDisplayComponent } from '../../components/family-display/family-display.component';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [FamilyDisplayComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})
export class FamilyComponent {

}
