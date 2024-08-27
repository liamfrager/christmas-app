import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { IconComponent } from '../icon/icon.component';
import { User } from '../../types';

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './user-display.component.html',
  styleUrl: './user-display.component.css'
})
export class UserDisplayComponent {
  constructor(private accountService: AccountService) {};
  @Input({required: true}) user!: User;
  @Input() icons?: {[icon: string]: () => void } = {};
}
