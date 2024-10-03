import { Component, ViewChild } from '@angular/core';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { AccountService } from '../../services/account.service';
import { UserDisplayComponent } from "../../components/user-display/user-display.component";
import { IconComponent } from "../../components/icon/icon.component";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../types';
import { CommonModule } from '@angular/common';
import { FriendsService } from '../../services/friends.service';
import { PopUpComponent } from "../../components/pop-up/pop-up.component";
import { FriendsDisplayComponent } from "../../components/friends-display/friends-display.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, UserDisplayComponent, IconComponent, PopUpComponent, FriendsDisplayComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(
    private accountService: AccountService,
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router
  ) {};
  currentUserID = this.accountService.currentUserID;
  user?: User;
  friendStatus?: 'incoming' | 'outgoing' | 'friends';
  isEditing: boolean = false;

  async ngOnInit() {
    const userID = this.route.snapshot.paramMap.get('id');
    if (userID) {
      if (userID === this.currentUserID) {
        this.router.navigate(['/profile']);
      } else {
        const friend = await this.friendsService.getFriend(userID);
        if (friend) {
          this.user = friend;
          this.friendStatus = friend.status;
        } else {
          this.user = await this.accountService.getUserInfo(userID);
        }
      }
    } else {
      this.user = this.accountService.currentUser;
    }
  }

  viewFriends() {
    if (this.user?.id === this.currentUserID) {
      this.router.navigate([`/friends`]);
    } else {
      const dialog = document.getElementsByTagName('dialog')[0];
      dialog.showModal();
      document.getElementsByTagName('body')[0].style.setProperty('overflow', 'hidden');
    }
  }

  hideFriends() {
    const dialog = document.getElementsByTagName('dialog')[0];
    dialog.close();
    document.getElementsByTagName('body')[0].style.removeProperty('overflow');
  }

  viewList() {
    this.router.navigate([`/profile/${this.user!.id}/wish-list`]);
  }

  editProfile() {
    this.isEditing = true;
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  sendFriendRequest() {
    this.friendsService.sendFriendRequest(this.user!);
    this.friendStatus = 'outgoing';
  }

  acceptFriendRequest() {
    this.friendsService.acceptFriendRequest(this.user!);
    this.friendStatus = 'friends';
  }

  removeFriend() {
    this.friendsService.removeFriend(this.user!);
    this.friendStatus = undefined;
  }
}
