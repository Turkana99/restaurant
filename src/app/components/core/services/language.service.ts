import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private languageSubject = new BehaviorSubject<string>('az-AZ');
  currentLanguage$ = this.languageSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Getter to expose the current value of languageSubject
  get currentLanguageValue(): string {
    return this.languageSubject.value;
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(environment.getLanguagesUrl);
  }

  setLanguage(language: string) {
    this.languageSubject.next(language);
  }
}
