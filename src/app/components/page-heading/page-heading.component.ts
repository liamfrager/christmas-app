import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Router } from '@angular/router';
import { BadgeComponent } from "../ui/badge/badge.component";

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.css'
})
export class PageHeadingComponent {
  constructor(public router: Router) {};
  @Input({required: true}) headingText!: string;
  @Input() buttons!: string[];
  @Input() imageURL: string | null = null;
  @Input() buttonBadges?: (boolean | number | string)[] = [];
  @Output() onBackButton =  new EventEmitter();
  @Output() onIconClick = new EventEmitter();
}
