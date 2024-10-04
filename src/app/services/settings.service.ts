import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { Settings } from '../types';
import { FirebaseService } from './firebase.service';
import { doc, DocumentReference, getDoc, setDoc, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(
    private firebaseService: FirebaseService,
    private accountService: AccountService
  ) {}

  private _defaultSettings: Settings = {
    showHeader: true,
  }

  async loadSettings() {
    const settings = await this.fetchSettings();
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  private get _localSettings(): Settings {
    return JSON.parse(localStorage.getItem('settings')!) as Settings;
  }

  public get settings(): Settings {
    if (this._localSettings)
      return this._localSettings;
    this.loadSettings();
    return this._defaultSettings;
  }

  async fetchSettings(): Promise<Settings> {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    const settingsSnap = await getDoc(settingsRef);
    const userSettings = settingsSnap.data() as Settings;
    if (userSettings) {
      return {...this._defaultSettings, ...userSettings};
    }
    setDoc(settingsRef, {});
    return this._defaultSettings;
  }

  async updateSettings(updates: any) {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    updateDoc(settingsRef, updates);
    localStorage.setItem('settings', JSON.stringify({...this._localSettings, ...updates}));
  }

  async restoreDefault() {
    const settingsRef = doc(this.firebaseService.db, 'settings', this.accountService.currentUserID!);
    setDoc(settingsRef, this._defaultSettings);
    localStorage.setItem('settings', JSON.stringify(this._localSettings));
  }
}