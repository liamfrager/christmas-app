import { Component } from '@angular/core';
import { UserBubbleComponent } from '../../../components/user-bubble/user-bubble.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { AccountService } from '../../../services/account.service';
import { DocumentData, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';

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
  currentUser: DocumentData | undefined = this.accountService.currentUser;
  searchedUser: DocumentData | undefined = undefined;
  icon = "person_add";

  async onSubmit(form: NgForm) {
    const searchedEmail = form.form.value.searchedEmail
    console.log("promise", this.currentUser)
    const currentUser = await this.currentUser; // here this.currentUser returns a Promise that resolves with "async", but later on...
    console.log("resolved promise", currentUser);
      if (searchedEmail !== currentUser?.['email']) {
          const q = query(collection(this.db, "users"), where('email', '==', searchedEmail));
          const docRef = await getDocs(q);
          docRef.forEach(snap => {
            this.searchedUser = snap.data();
            this.icon = this.isFamilyMember(this.searchedUser?.['uid']) ? "check" : "person_add";
          })
      }
  }

  isFamilyMember( searchedUserUID: string) {
    if(this.currentUser?.['family']) {
        return searchedUserUID !== undefined ? this.currentUser['family'].indexOf(searchedUserUID) >= 0 : false;
    }
    return false;
  }
  
  async addFriend(uid: string) {
    console.log("returns undefined", this.currentUser);
    const currentUser = await this.currentUser; // ...here this.currentUser returns undefined.
    console.log("still undefined", currentUser)
    if (this.icon === "person_add") {
      this.icon = "check";
      let newFamilyMembers;
      if (this.currentUser?.['family'].length > 0 && this.currentUser?.['family'].indexOf(uid) < 0) {
        newFamilyMembers = [...this.currentUser?.['family'], uid];
      } else {
        newFamilyMembers = [uid]
      }
      
      try {
        const docRef = doc(this.db, "users", this.currentUser?.['uid']);
        updateDoc(docRef, {
          family: newFamilyMembers
        }).then( (x) => {
          console.log(x);
        })
        console.log("Document updated with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
