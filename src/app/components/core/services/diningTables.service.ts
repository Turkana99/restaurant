import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root', // Ensure this is present
})
export class DiningTablesService {
  constructor(private http: HttpClient) {}

  getDiningTables(): Observable<any> {
    return this.http.get<any>(environment?.getDiningTablesUrl);
  }
}
