import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://localhost:44301/api/logs';

  constructor(private http: HttpClient) {}

  getLogs(filter: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/filter`, filter, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    });
  }

  exportLogsToExcel(logs: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/export`, logs, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        
      })
    });
  }
}
