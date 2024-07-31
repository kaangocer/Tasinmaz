import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TasinmazDTO } from 'src/models/DTOs/tasinmaz-dto';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {

  private apiUrl = 'https://localhost:44301/api/Tasinmaz'; // API'nin base URL'si
  
  TOKEN_KEY="token";
  constructor(private http: HttpClient,private authService: AuthService) { }

   getTasinmazlar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getTasinmaz(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getTasinmazByKullaniciId(userId: number): Observable<TasinmazDTO[]> {
    return this.http.get<TasinmazDTO[]>(`${this.apiUrl}/GetByKullaniciId?id=${userId}`);
  }
  
 // getTasinmazByKullaniciId(id: number): Observable<any> {
 //   return this.http.get<any>(`${this.apiUrl}/GetByKullaniciId?id=${id}`);
 // }
//EKLEME İŞLEMİ İÇİN EKLEDİGİM
addTasinmaz(tasinmaz: any): Observable<any> {
  const token = localStorage.getItem(this.TOKEN_KEY);
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.token}`,
    
  });

  return this.http.post<any>(this.apiUrl, tasinmaz, { headers });
}
deleteTasinmaz(id: number): Observable<void> {
  const token = localStorage.getItem(this.TOKEN_KEY);
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.token}`
  });

  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
}
updateTasinmaz(tasinmaz: any): Observable<any> {
  const token = localStorage.getItem(this.TOKEN_KEY);
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.token}`
  });
  
  return this.http.put<any>(`${this.apiUrl}/${tasinmaz.tasinmazId}`, tasinmaz, { headers });
}
 

getAllProperties(): Observable<TasinmazDTO[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.token}` // Token'ı Authorization başlığına ekleyin
  });
  return this.http.get<TasinmazDTO[]>(`${this.apiUrl}/GetAllProperties`, { headers: headers });
}
}
