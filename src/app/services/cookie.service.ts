import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor() { }

  getCookie(key: String): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2)
      return parts.pop()?.split(';').shift() || null;
    return null;
  }

  setCookie (key: string, value: string, minutesToExpire?: number): void {
    if (minutesToExpire) {
      const date = new Date();
      date.setTime(date.getTime() + (minutesToExpire * 60 * 1000));
      document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/;`;
    } else {
      document.cookie = `${key}=${value}; path=/;`;
    }
  }

  deleteCookie(key: string) {
    this.setCookie(key, '', -1);
  }
}
