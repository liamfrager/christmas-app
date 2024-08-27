import { Component, OnInit } from '@angular/core';
import { UserBubbleComponent } from '../../../components/user-bubble/user-bubble.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { DocumentData, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';
import { User } from '../../../types';
import { FriendsService } from '../../../services/friends.service';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FormsModule, UserBubbleComponent, CommonModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css'
})
export class AddFriendComponent implements OnInit {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService, private friendsService: FriendsService) {}

  db = this.firebaseService.db;
  searchResults: Array<User> = [];
  icon = "person_add";
  incomingFriendRequests: Array<User> = [];

  async ngOnInit(): Promise<void> {
    this.incomingFriendRequests = await this.friendsService.getFriendRequests();
  }

  async searchUsers(form: NgForm) {
    console.log('searching...');
    const searchQuery = form.form.value.searchQuery.replace(/\s+/g, '').toLowerCase();
    console.log(searchQuery)
    const currentUser = this.accountService.currentUser;
    const q = query(collection(this.db, "users"), where('searchName', '>=', searchQuery), where('searchName', '<=', searchQuery + '\uf8ff'));
    const docRef = await getDocs(q);
    docRef.forEach(async snap => {
      this.searchResults.push(snap.data() as User);
      console.log(snap.data())
      // this.icon = this.isFriend(this.searchedUser?.['uid']) ? "check" : "person_add";
    })
  }

  isFriend(searchedUserUID: string) {
    const currentUser = this.accountService.currentUser;;
    if (currentUser['friends'] && searchedUserUID) {
      return currentUser['friends'].indexOf(searchedUserUID) >= 0;
    }
    return false;
  }
}
