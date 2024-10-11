import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageFetchService {
  constructor(private http: HttpClient) {console.log('image fetch init', this.http)}

  getImageFromUrl(url: string): Observable<string | null> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(response => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response, 'text/html');
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
        return ogImage || twitterImage || null;
      }),
      catchError(error => {
        console.error('Error fetching image:', error);
        return of(null);
      })
    );
  }
}