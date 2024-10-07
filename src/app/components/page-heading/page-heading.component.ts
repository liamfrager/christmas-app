import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.css'
})
export class PageHeadingComponent {
  constructor(public router: Router) {};
  @Input({required: true}) headingText!: string;
  @Input() buttons!: string[];
  @Output() onBackButton =  new EventEmitter();
  @Output() onIconClick = new EventEmitter();
}
