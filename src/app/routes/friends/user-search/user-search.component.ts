import { Component, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { CommonModule, Location } from '@angular/common';
import { User } from '../../../types';
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';
import { CookieService } from '../../../services/cookie.service';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [FormsModule, UserDisplayComponent, CommonModule, PageHeadingComponent],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private accountService: AccountService,
    private cookieService: CookieService,
    public router: Router,
    public location: Location,
  ) {}
  db = this.firebaseService.db;
  get searchQuery() : string | null {
    const cookie = this.cookieService.getCookie('searchQuery');
    return cookie;
  }
  set searchQuery(value) {
    if (value)
      this.cookieService.setCookie('searchQuery', value);
    else
      this.cookieService.deleteCookie('searchQuery');
  }
  searchResults: Array<User> | null | undefined;

  async ngOnInit(): Promise<void> {
    if (this.searchQuery)
      this.searchResults = await this.searchUsers(this.searchQuery);
  }
  
  /**
   * Handles #searchUserForm submission.
   * @param form - The form object.
   */
  async onFormSubmit(form: NgForm) {
    if (form.form.value.searchQuery === null) {
      this.searchResults = null;
    } else {
      this.searchQuery = form.form.value.searchQuery;
      this.searchResults = await this.searchUsers(this.searchQuery!)
    }
  }

  /**
   * Searches the database for Users whose displayName starts or ends with a search term.
   * @param searchTerm - A string that is used to search for users.
   * @returns A promise that gives an array of users when resolved.
   */
  async searchUsers(searchTerm: string): Promise<Array<User>> {
      const modifiedSearchQuery = searchTerm.replace(/\s+/g, '').toLowerCase();
      const q = query(collection(this.db, "users"), where('searchName', '>=', modifiedSearchQuery), where('searchName', '<=', modifiedSearchQuery + '\uf8ff'));
      const docRef = await getDocs(q);
      let results: Array<User> = [];
      docRef.forEach(async snap => {
        if ((snap.data() as User).id !== this.accountService.currentUserID) {
          results.push(snap.data() as User);
        }
      });
      return results;
  }
}
