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

  db = this.firebaseService.db;
  searchResults: Array<User> | null | undefined;
  incomingFriendRequests: Array<Friend> = [];

  async ngOnInit(): Promise<void> {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
  }

  async searchUsers(form: NgForm) {
    this.searchResults = null;
    const searchQuery = form.form.value.searchQuery.replace(/\s+/g, '').toLowerCase();
    const currentUser = this.accountService.currentUser;
    const q = query(collection(this.db, "users"), where('searchName', '>=', searchQuery), where('searchName', '<=', searchQuery + '\uf8ff'));
    const docRef = await getDocs(q);
    this.searchResults = [];
    docRef.forEach(async snap => {
      if (this.searchResults && (snap.data() as User).id !== currentUser.id) {
        this.searchResults.push(snap.data() as User);
      }
    })
  }

  onButtonClick(user: User) {

  }

  isFriend(searchedUserUID: string) {
    const currentUser = this.accountService.currentUser;;
    if (currentUser['friends'] && searchedUserUID) {
      return currentUser['friends'].indexOf(searchedUserUID) >= 0;
    }
    return false;
  }
}
