import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { Settings } from '../types';
import { FirebaseService } from './firebase.service';
import { doc, DocumentReference, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(
    private firebaseService: FirebaseService,
    private accountService: AccountService
  ) {}

  private defaultSettings: Settings = {
    showHeader: true,
  }

  private settingsSubject = new BehaviorSubject<Settings>(this.defaultSettings);
  settings$ = this.settingsSubject.asObservable();

  async loadSettings() {
    const settings = await this.fetchSettings();
    this.settingsSubject.next(settings);
  }

  private async fetchSettings(): Promise<Settings> {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    const settingsSnap = await getDoc(settingsRef);
    const userSettings = settingsSnap.data() as Settings;
    if (userSettings) {
      return {...this.defaultSettings, ...userSettings};
    }
    setDoc(settingsRef, {});
    return this.defaultSettings;
  }

  async updateSettings(updates: any) {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    updateDoc(settingsRef, updates);
    const newSettings = {...this.settingsSubject.value, ...updates};
    this.settingsSubject.next(newSettings);
  }

  async restoreDefault() {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    setDoc(settingsRef, this.defaultSettings);
    this.settingsSubject.next(this.defaultSettings);
  }
}