import { Component, EventEmitter, Input, Output } from '@angular/core';
import { List, NewList, User } from '../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { GiftListService } from '../../../services/gift-list.service';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './list-form.component.html',
  styleUrl: './list-form.component.css'
})
export class ListFormComponent {
  constructor(
    private giftListService: GiftListService, 
    private accountService: AccountService,
  ) {}
  @Input() list?: List;
  @Output() onFormSubmit = new EventEmitter();
  
  // Form values
  nameVal?: string;

  async ngOnInit() {
    this.nameVal = this.list ? this.list.name : '';
  }

  async onSubmit(form: NgForm) {
    const newList: NewList = {
      name: form.form.value.list,
      owner: await this.accountService.getUserInfo(this.accountService.currentUserID!) as User,
    }
    if (this.list) { // If editing list.
      if (JSON.stringify(this.list) == JSON.stringify({...this.list, ...newList})) { // If list hasn't changed.
        this.onFormSubmit.emit(false);
      } else {
        this.giftListService.updateList(this.list, newList);
        this.onFormSubmit.emit(newList);
      }
    } else {
      this.onFormSubmit.emit(newList);
    }
  }
}
