import { Component } from '@angular/core';
import { PageHeadingComponent } from "../../components/page-heading/page-heading.component";
import { AccountService } from '../../services/account.service';
import { IconComponent } from "../../components/icon/icon.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../types';
import { CommonModule, Location } from '@angular/common';
import { FriendsService } from '../../services/friends.service';
import { PopUpComponent } from "../../components/pop-up/pop-up.component";
import { ProfileFormComponent } from "../../components/forms/profile-form/profile-form.component";
import { NgForm } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeadingComponent, IconComponent, PopUpComponent, ProfileFormComponent, PickerComponent, EmojiComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(
    private accountService: AccountService,
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
  ) {};
  currentUserID = this.accountService.currentUserID;
  user?: UserProfile;
  friendStatus?: 'incoming' | 'outgoing' | 'friends';
  isEditing: boolean = false;
  showMoodSelector: boolean = false;
  userID: string | null = null;

  async ngOnInit() {
    const userID = this.route.snapshot.paramMap.get('user-id');
    this.userID = userID;
    if (userID && userID !== this.currentUserID) {
      const friend = await this.friendsService.getFriend(userID);
      if (friend)
        this.friendStatus = friend.status;
      this.user = await this.accountService.getUserInfo(userID, true);
    } else {
      this.user = await this.accountService.getUserInfo(this.accountService.currentUserID!, true);
    }
  }

  @RefreshService.onRefresh()
  async onRefresh() {
    if (this.userID)
      this.user = await this.accountService.getUserInfo(this.userID, true);
  }

  handleEmojiEvent(mouseEvent: MouseEvent) {
    if (!document.querySelector('emoji-mart')?.contains(mouseEvent.target as Node))
      this.showMoodSelector = !this.showMoodSelector;
  }

  selectMood() {
    if (this.user?.id === this.currentUserID)
      this.showMoodSelector = !this.showMoodSelector;
  }

  updateMood(event: any) {
    this.showMoodSelector = false;
    const emoji: string = event.emoji.colons;
    this.user!.mood = emoji;
    this.accountService.updateProfile({mood: emoji});
    localStorage.setItem('mood', emoji);
  }

  viewFriends() {
    this.router.navigate(['profile', this.user!.id, 'friends']);
  }

  hideFriends() {
    const dialog = document.getElementsByTagName('dialog')[0];
    dialog.close();
    document.getElementsByTagName('body')[0].style.removeProperty('overflow');
  }

  viewLists() {
    this.router.navigate(['profile', this.user!.id, 'wish-lists']);
  }

  onProfileEdited(form: NgForm) {
    if (form.form.dirty) {
      const displayName = form.form.value.name;
      const bio = form.form.value.bio;
      this.accountService.updateProfile({
        displayName: displayName,
        bio: bio,
      }).then(() => {
        localStorage.setItem('displayName', displayName);
        localStorage.setItem('bio', bio);
      })
    }
    this.isEditing = false;
  }

  goToSettings() {
    this.router.navigate(['/profile/settings']);
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
