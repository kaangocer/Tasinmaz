import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlService {

  private apiUrl = 'https://localhost:44301/api/il'; // API'nin base URL'si

  constructor(private http: HttpClient) { }

  getIller(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}