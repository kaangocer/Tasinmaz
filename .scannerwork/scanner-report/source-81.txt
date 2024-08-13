import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlceService {
  getMahallelerByIlceId(selectedIlceId: number) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'https://localhost:44301/api/ilce'; // API'nin base URL'si

  constructor(private http: HttpClient) { }

  getIlceler(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  
  getIlcelerByIlId(ilId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ByIlId/${ilId}`);
  }

}




