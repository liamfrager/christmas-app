import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, User } from '../../types';
import { CommonModule } from '@angular/common';
import { GiftExchangeService } from '../../services/gift-exchange.service';
import { UserDisplayComponent } from "../user-display/user-display.component";
import { AccountService } from '../../services/account.service';
import { PageHeadingComponent } from "../page-heading/page-heading.component";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-gift-exchange',
  standalone: true,
  imports: [CommonModule, UserDisplayComponent, PageHeadingComponent, IconComponent],
  templateUrl: './gift-exchange.component.html',
  styleUrl: './gift-exchange.component.css'
})
export class GiftExchangeComponent {
  constructor(
    private accountService: AccountService,
    private giftExchangeService: GiftExchangeService,
  ) {};

  @Input() group!: Group;
  @Output() onShowModal = new EventEmitter();
  currentUserID?: string = this.accountService.currentUserID;
  isShowModal: boolean = false;
  modalErrorMessage?: string;


  showModal(bool: boolean) {
    this.isShowModal = bool;
    this.onShowModal.emit(bool);
  }

  handleCreateGiftExchange() {
    if (this.group.members!.length < 2) this.modalErrorMessage = "This group does not have enough members to create a group!";
    this.showModal(true);
  }

  handle() {
    if (this.group.giftExchangeMap) return;
    this.group = this.giftExchangeService.createGiftExchange(this.group);
  }

  handleGiftExchangeUserSelect(member: User) {

  }
}
