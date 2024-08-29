import { Component, OnInit } from '@angular/core';
import { UserDisplayComponent } from '../../../components/user-display/user-display.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { DocumentData, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';
import { Friend, User } from '../../../types';
import { FriendsService } from '../../../services/friends.service';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FormsModule, UserDisplayComponent, CommonModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css'
})
export class AddFriendComponent implements OnInit {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService, private friendsService: FriendsService) {}
  currentUser = this.accountService.currentUser;;
  db = this.firebaseService.db;
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
  }

  async searchUsers(form: NgForm) {
    if (form.form.value.searchQuery.length > 0) {
      this.searchResults = null;
      const searchQuery = form.form.value.searchQuery.replace(/\s+/g, '').toLowerCase();
      const q = query(collection(this.db, "users"), where('searchName', '>=', searchQuery), where('searchName', '<=', searchQuery + '\uf8ff'));
      const docRef = await getDocs(q);
      this.searchResults = [];
      docRef.forEach(async snap => {
        if (this.searchResults && (snap.data() as User).id !== this.currentUser.id) {
          this.searchResults.push(snap.data() as User);
        }
      });
    }
  }

  getSearchIconActions(user: User): Map<string, () => void> {
    let iconActions = new Map<string, () => void>();
    const status = this.getFriendStatus(user);
    const icon = (status === 'friend' || status === 'outgoing') ? 'check': 'person_add';
    iconActions.set(icon, () => this.onSendFriendRequest(user));
    return iconActions;
  }

  getFriendRequestIconActions(friendRequest: Friend): Map<string, () => void> {
    let iconActions = new Map<string, () => void>();
    if (friendRequest.status === 'friend') {
      iconActions.set('check', () => {});
      return iconActions;
    }
    iconActions.set('close', () => this.onRejectFriendRequest(friendRequest));
    iconActions.set('person_add', () => this.onAcceptFriendRequest(friendRequest));
    return iconActions;
  }

  onSendFriendRequest(user: User) {
    this.friendsStatuses = {
      ...this.friendsStatuses,
      [user.id]: 'outgoing'
    };
    this.friendsService.sendFriendrequest(user);
  }

  onAcceptFriendRequest(user: Friend) {
    this.friendsStatuses = {
      [user.id]: 'friend'
    };
    this.incomingFriendRequests.splice(this.incomingFriendRequests.indexOf(user))
    this.friendsService.acceptFriendRequest(user);
  }

  onRejectFriendRequest(user: Friend) {
    this.incomingFriendRequests.splice(this.incomingFriendRequests.indexOf(user))
    this.friendsService.removeFriend(user)
  }

  getFriendStatus(user: User): string {
    return this.friendsStatuses[user.id];
  }
}
