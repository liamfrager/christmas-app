import { db, auth } from './firebase.js';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

export const account = {
    updateUserInfo() {
        const docRef = doc(db, 'users', this.currentUser.uid)
        getDoc(docRef).then(snap => {
            this.currentUser = snap.data();
        })
    },
    isNewUser(user) {
        const docRef = doc(db, 'users', user.uid)
        getDoc(docRef).then(() => {
            return true;
        }).catch(() => {
            return false;
        })
    },
    createNewUser(user) {   
        const docRef = doc(db, 'users', user.uid)
        setDoc(docRef, {
            displayName: user.displayName,
            email: user.email,
            pfp: user.photoURL,
            family: []
        }).then(() => {
            this.getUserInfo(user);
        });
    },
    getUserInfo(user) {
        const docRef = doc(db, 'users', user.uid)
        getDoc(docRef).then(snap => {
            this.currentUser = snap.data();
        });
    },
    logoutUser() {
        const auth = getAuth();
        signOut(auth).then(() => {
            goto('/', { replaceState: true })
            this.currentUser = {};
        }).catch((error) => {
            console.error('Could not logout')
            // An error happened.
        });
    }
};

onAuthStateChanged(auth, (userInfo) => {
    if (userInfo) {
        userInfoFromGoogle.set(userInfo);
        get(account).getUserInfo(userInfo);
    } else {
        userInfoFromGoogle.set(null);
    }
  })