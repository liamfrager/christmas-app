import { Component, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { CommonModule, Location } from '@angular/common';
import { Friend, User } from '../../../types';
import { FriendsService } from '../../../services/friends.service';
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';
import { CookieService } from '../../../services/cookie.service';
import { RefreshService } from '../../../services/refresh.service';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FormsModule, UserDisplayComponent, CommonModule, PageHeadingComponent],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css'
})
export class AddFriendComponent implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private accountService: AccountService,
    private friendsService: FriendsService,
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
  friendsStatuses: Record<string, string> = {};
  incomingFriendRequests: Array<Friend> = [];

  async ngOnInit(): Promise<void> {
    if (this.searchQuery)
      this.searchResults = await this.searchUsers(this.searchQuery);
  }

  @RefreshService.onRefresh()
  async loadFriendData() {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
    const friends = await this.friendsService.getAllFriendsAndRequests()
    if (friends.length > 0) {
      this.friendsStatuses = friends.reduce( (obj: Record<string, string>, friend) => {
        obj[friend.id] = friend.status;
        return obj as Record<string, string> ;
      }, {});
    }
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

  /**
   * Handles when a friend request is sent.
   * @param user - A User object representing the intended recipient of the friend request.
   */
  onSendFriendRequest(user: User) {
    this.friendsStatuses = {
      ...this.friendsStatuses,
      [user.id]: 'outgoing'
    };
    this.friendsService.sendFriendRequest(user);
  }

  /**
   * Handles when a friend request is accepted.
   * @param user - A Friend object representing the sender of the incoming friend request.
   */
  onAcceptFriendRequest(user: Friend) {
    this.friendsStatuses = {
      [user.id]: 'friends'
    };
    this.incomingFriendRequests.splice(this.incomingFriendRequests.indexOf(user))
    this.friendsService.acceptFriendRequest(user);
  }

  /**
   * Handles when a friend request is rejected.
   * @param user - A Friend object representing the sender of the incoming friend request.
   */
  onRejectFriendRequest(user: Friend) {
    this.incomingFriendRequests.splice(this.incomingFriendRequests.indexOf(user))
    this.friendsService.removeFriend(user)
  }

}
