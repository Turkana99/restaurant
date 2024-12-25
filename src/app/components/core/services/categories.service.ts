import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  // Fetch categories based on the selected language
  getCategoriesByLanguage(language: string): Observable<any> {
    const headers = new HttpHeaders({
      language,
    });
    return this.http.get<any>(environment?.getCategoriesUrl, { headers });
  }
}
