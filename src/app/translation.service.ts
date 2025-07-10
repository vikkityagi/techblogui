import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
   // Replace 'YOUR_GOOGLE_CLOUD_API_KEY' with your actual API key
  private apiKey = 'AIzaSyDmp6d17py0GWuwSCcoZcGsIe-XsB9PSoI';
  private apiUrl = 'https://translation.googleapis.com/language/translate/v2'; // Google Cloud Translation API endpoint

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string): Observable<string> { // Changed return type to string
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', text)
      .set('target', targetLang)
      .set('source', 'en') // Assuming originalText is always English based on your component
      .set('format', 'text');

    return this.http.post<any>(this.apiUrl, {}, { params }).pipe(
      map(res => {
        // Google Cloud Translation API response structure
        // is res.data.translations[0].translatedText
        if (res && res.data && res.data.translations && res.data.translations.length > 0) {
          return res.data.translations[0].translatedText;
        } else {
          throw new Error('Invalid translation response');
        }
      })
    );
  }

}
