import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {

  private apiUrl = 'https://localhost:44301/api/tasinmaz'; // API'nin base URL'si

  constructor(private http: HttpClient) { }

  getTasinmazlar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getTasinmaz(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

//EKLEME İŞLEMİ İÇİN EKLEDİGİM
addTasinmaz(tasinmaz: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, tasinmaz);
}
deleteTasinmaz(id: number): Observable<void> {
  console.log(`DELETE request sent to: ${this.apiUrl}/${id}`);
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
updateTasinmaz(tasinmaz: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${tasinmaz.tasinmazId}`, tasinmaz);
}
 
}
