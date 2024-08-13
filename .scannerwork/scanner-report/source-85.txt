import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MahalleService {

  private apiUrl = 'https://localhost:44301/api/mahalle'; // API'nin base URL'si

  constructor(private http: HttpClient) { }

  getMahalleler(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }


  //son ekledigim
  getMahallelerByIlceId(ilceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ilce/${ilceId}/mahalleler`);
  }

  getMahalle(mahalleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/{id}`);
  }
  
}
