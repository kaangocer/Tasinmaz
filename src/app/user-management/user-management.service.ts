// user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../models/UserDTO'; // Kullanıcı DTO'nuzu import edin
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'https://localhost:44301/api/User'; // API URL'nizi buraya yazın

  constructor(private http: HttpClient,private authService: AuthService) {}

  getAllUsers(): Observable<UserDTO[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.http.get<UserDTO[]>(`${this.apiUrl}/GetAllUsers`, { headers });
  }

  deleteUser(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/DeleteUser/${id}`, { headers });
  }

  addUser(user: UserDTO): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.http.post<void>(`${this.apiUrl}/AddUser`, user, { headers });
  }

  updateUser(user: UserDTO): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.http.put<void>(`${this.apiUrl}/UpdateUser`, user, { headers });
  }

}
