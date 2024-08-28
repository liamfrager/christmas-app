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
  friendsIDs: Array<string> = [];
  incomingFriendRequests: Array<Friend> = [];

  async ngOnInit(): Promise<void> {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
    this.friendsIDs = (await this.friendsService.getFriends()).map( friend => friend.id)
  }

  async searchUsers(form: NgForm) {
    this.searchResults = null;
    const searchQuery = form.form.value.searchQuery.replace(/\s+/g, '').toLowerCase();
    const q = query(collection(this.db, "users"), where('searchName', '>=', searchQuery), where('searchName', '<=', searchQuery + '\uf8ff'));
    const docRef = await getDocs(q);
    this.searchResults = [];
    docRef.forEach(async snap => {
      if (this.searchResults && (snap.data() as User).id !== this.currentUser.id) {
        this.searchResults.push(snap.data() as User);
      }
    })
  }

  getSearchIcons(user: User) {
    const icons = {
      [this.isFriend(user) ? 'check': 'person_add']: () => this.onSendFriendRequest(user),
    }
    return icons
  }

  getFriendRequestIcons(friendRequest: Friend): {[icon: string]: () => void } {
    if (friendRequest.status == 'friend') {
      return {
        'cross': () => this.onRejectFriendRequest(friendRequest),
        'person_add': () => this.onAcceptFriendRequest(friendRequest),
      }
    }
    return {
      'check': () => {},
    }
  }

  onSendFriendRequest(user: User) {
    this.friendsIDs.push(user.id)
  }

  onAcceptFriendRequest(user: Friend) {
    this.friendsIDs.push(user.id)
  }

  onRejectFriendRequest(user: Friend) {
    
  }

  isFriend(user: User) {
    return this.friendsIDs.indexOf(user.id) >= 0;
  }
}
