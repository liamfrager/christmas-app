import { Component, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';
import { Friend, User } from '../../../types';
import { FriendsService } from '../../../services/friends.service';
import { PageHeadingComponent } from "../../../components/page-heading/page-heading.component";
import { Router } from '@angular/router';

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
    public router: Router
  ) {}
  db = this.firebaseService.db;
  get searchQuery() : string | null {
    return localStorage.getItem('searchQuery');
  }
  set searchQuery(value) {
    if (value)
      localStorage.setItem('searchQuery', value);
    else
      localStorage.removeItem('searchQuery');
  }
  searchResults: Array<User> | null | undefined;
  friendsStatuses: Record<string, string> = {};
  incomingFriendRequests: Array<Friend> = [];

  async ngOnInit(): Promise<void> {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
    const friends = await this.friendsService.getAllFriendsAndRequests()
    if (friends.length > 0) {
      this.friendsStatuses = friends.reduce( (obj: Record<string, string>, friend) => {
        obj[friend.id] = friend.status;
        return obj as Record<string, string> ;
      }, {});
    }
    if (this.searchQuery)
      this.searchResults = await this.searchUsers(this.searchQuery);
  }
  
  /**
   * Handles #searchUserForm submission.
   * @param form - The form object.
   */
  async onFormSubmit(form: NgForm) {
    if (form.form.value.searchQuery.length > 0) {
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
   * Returns icons and functions to be used in app-user-display.iconActions.
   * @param user - A User object representing the result of a search query.
   * @returns A map of icon names and anonymous functions to be executed when said icons are clicked.
   */
  getSearchIconActions(user: User): Map<string, () => void> {
    let iconActions = new Map<string, () => void>();
    const status = this.friendsStatuses[user.id];
    const icon = (status === 'friends' || status === 'outgoing') ? 'check': 'person_add';
    iconActions.set(icon, () => this.onSendFriendRequest(user));
    return iconActions;
  }

  /**
   * Returns icons and functions to be used in app-user-display.iconActions.
   * @param friendRequest - A Friend object representing the sender of an incoming friend request.
   * @returns A map of icon names and anonymous functions to be executed when said icons are clicked.
   */
  getFriendRequestIconActions(friendRequest: Friend): Map<string, () => void> {
    let iconActions = new Map<string, () => void>();
    if (friendRequest.status === 'friends') {
      iconActions.set('check', () => {});
      return iconActions;
    }
    iconActions.set('close', () => this.onRejectFriendRequest(friendRequest));
    iconActions.set('person_add', () => this.onAcceptFriendRequest(friendRequest));
    return iconActions;
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
