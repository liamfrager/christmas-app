import { Component, Input } from '@angular/core';
import { Group } from '../../types';
import { CommonModule } from '@angular/common';
import { GiftExchangeService } from '../../services/gift-exchange.service';
import { UserDisplayComponent } from "../user-display/user-display.component";
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-gift-exchange',
  standalone: true,
  imports: [CommonModule, UserDisplayComponent],
  templateUrl: './gift-exchange.component.html',
  styleUrl: './gift-exchange.component.css'
})
export class GiftExchangeComponent {
  constructor(
    private accountService: AccountService,
    private giftExchangeService: GiftExchangeService,
  ) {};

  @Input() group!: Group;
  currentUserID?: string = this.accountService.currentUserID;

  handleCreateGiftExchange() {
    if (this.group.giftExchangeMap) return;
    this.group = this.giftExchangeService.createGiftExchange(this.group);
  }
}
