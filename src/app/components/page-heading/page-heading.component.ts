import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.css'
})
export class PageHeadingComponent {
  constructor(private router: Router) {};
  @Input({required: true}) headingText!: string;
  @Input() buttons!: string[];
  @Output() onIconClick = new EventEmitter();
}
