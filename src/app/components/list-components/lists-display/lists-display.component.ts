import { Component, Input } from '@angular/core';
import { List, WishLists } from '../../../types';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../icon/icon.component";
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './lists-display.component.html',
  styleUrl: './lists-display.component.css'
})
export class ListsDisplayComponent {
  constructor(private router: Router, private accountService: AccountService) {};
  @Input({ required: true }) lists!: WishLists;
  get isOwnedByCurrentUser(): boolean { return this.lists.owner.id === this.accountService.currentUserID }
  noListsMessage: string = 
    this.lists ?
    this.isOwnedByCurrentUser ?
    `You have no lists` :
    `${this.lists.owner!.displayName} has no lists` :
    'Could not load lists';;

  ngOnChanges() {
    this.noListsMessage = 
    this.lists ?
    this.isOwnedByCurrentUser ?
    `You have no lists` :
    `${this.lists.owner.displayName} has no lists` :
    'Could not load lists';
  }

  goToList(list: List) {
    if (this.isOwnedByCurrentUser)
      this.router.navigate(['wish-lists', list.id]);
    else
      this.router.navigate(['profile', list.owner.id, 'wish-lists', list.id])
  }
}
