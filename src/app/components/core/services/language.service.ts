import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  lang!: string;
  culture!: string;
  private languageSubject = new BehaviorSubject<string>('');
  currentLanguage$!: any;

  constructor(private http: HttpClient) {
    this.lang = JSON.parse(localStorage.getItem('lang') as string);
    this.culture = (this.lang as any)?.culture || 'az-AZ';
    this.currentLanguage$ = this.languageSubject.asObservable();
    this.languageSubject.next(this.lang);
  }

  // Getter to expose the current value of languageSubject
  get currentLanguageValue(): string {
    return this.languageSubject.value;
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(environment.getLanguagesUrl);
  }

  setLanguage(language: { culture: string; displayName: string }) {
    localStorage.setItem('lang', JSON.stringify(language));
    this.lang = JSON.parse(localStorage.getItem('lang') as string);
    this.culture = (this.lang as any)?.culture;
    this.languageSubject.next(language.culture);
  }
}
