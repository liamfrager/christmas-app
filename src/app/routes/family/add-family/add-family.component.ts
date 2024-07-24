import { Component } from '@angular/core';
import { UserBubbleComponent } from '../../../components/user-bubble/user-bubble.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { DocumentData, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';
import { User } from '../../../types';

@Component({
  selector: 'app-add-family',
  standalone: true,
  imports: [FormsModule, UserBubbleComponent, CommonModule],
  templateUrl: './add-family.component.html',
  styleUrl: './add-family.component.css'
})
export class AddFamilyComponent {
  constructor(private firebaseService: FirebaseService, private accountService: AccountService) {};
  db = this.firebaseService.db;
  searchedUser: DocumentData | undefined = undefined;
  icon = "person_add";

  async onSubmit(form: NgForm) {
    const searchedEmail = form.form.value.searchedEmail
    const currentUser = this.accountService.currentUser;;
      if (searchedEmail !== currentUser?.['email']) {
          const q = query(collection(this.db, "users"), where('email', '==', searchedEmail));
          const docRef = await getDocs(q);
          docRef.forEach(async snap => {
            this.searchedUser = snap.data();
            this.icon = await this.isFamilyMember(this.searchedUser?.['uid']) ? "check" : "person_add";
          })
      }
  }

  isFamilyMember(searchedUserUID: string) {
    const currentUser = this.accountService.currentUser;;
    if(currentUser['family']) {
        return searchedUserUID !== undefined ? currentUser['family'].indexOf(searchedUserUID) >= 0 : false;
    }
    return false;
  }
  
  addFriend(uid: string) {
    const currentUser = this.accountService.currentUser;;
    if (this.icon === "person_add") {
      this.icon = "check";
      let newFamilyMembers;
      if (currentUser['family'].length > 0 && currentUser['family'].indexOf(uid) < 0) {
        newFamilyMembers = [...currentUser['family'], uid];
      } else {
        newFamilyMembers = [uid]
      }
      
      try {
        const docRef = doc(this.db, "users", currentUser['uid']);
        updateDoc(docRef, {
          family: newFamilyMembers
        });
        console.log("Document updated with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
