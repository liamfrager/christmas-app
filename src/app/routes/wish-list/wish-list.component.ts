import { Component, OnInit } from '@angular/core';
import { ListDisplayComponent } from '../../components/list-display/list-display.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [ListDisplayComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  constructor(private accountService: AccountService) {};
  uid: string = "no user logged in";

  async ngOnInit() {
    const uid = await this.accountService.getCurrentUserUID();
    if (uid) {this.uid = uid};
  }

  
}
