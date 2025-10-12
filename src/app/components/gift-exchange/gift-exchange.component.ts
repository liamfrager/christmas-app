import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, Member } from '../../types';
import { CommonModule } from '@angular/common';
import { GiftExchangeService } from '../../services/gift-exchange.service';
import { UserDisplayComponent } from "../user-display/user-display.component";
import { AccountService } from '../../services/account.service';
import { PageHeadingComponent } from "../page-heading/page-heading.component";
import { IconComponent } from "../icon/icon.component";
import { GiftExchangeFormComponent } from "../forms/gift-exchange-form/gift-exchange-form.component";
import { FillerComponent } from "../ui/filler/filler.component";

const MINIMUM_GIFT_EXCHANGE_MEMBERS: number = 4;

@Component({
  selector: 'app-gift-exchange',
  standalone: true,
  imports: [CommonModule, UserDisplayComponent, PageHeadingComponent, IconComponent, GiftExchangeFormComponent, FillerComponent],
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
  modalErrorMessages: string[] = [];
  showGiftExchangeAssignment: boolean = false;

  showModal(bool: boolean) {
    this.isShowModal = bool;
    this.onShowModal.emit(bool);
  }

  handleDefineGiftExchangeRestrictions() {
    this.modalErrorMessages = [];
    if (this.group.members!.filter(m => m.membershipStatus !== 'pending').length < MINIMUM_GIFT_EXCHANGE_MEMBERS) {
      this.modalErrorMessages?.push("This group does not have enough members to create a gift exchange!");
    }
    this.showModal(true);
  }

  async handleCreateGiftExchange(restrictionsMap: Record<string, Record<string, boolean>>) {
    this.group.giftExchangeRestrictions = restrictionsMap;
    this.group = await this.giftExchangeService.createGiftExchange(this.group);
  }

  showAssignment() {
    this.showGiftExchangeAssignment = true;
    setTimeout(() => {
      this.showGiftExchangeAssignment = false;
    }, 4000);
  }
}
