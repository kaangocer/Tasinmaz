import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginUser } from './models/loginUser';
import { RegisterUser } from './models/registerUser';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  path = 'https://localhost:44301/api/Auth/';
  TOKEN_KEY = 'token';
  LAST_URL_KEY = 'lastUrl';
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(loginUser: LoginUser): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    return this.httpClient
      .post<{ token: string }>(this.path + 'login', loginUser, { headers: headers })
      .pipe(
        map(response => {
          const token = response.token;
          this.saveToken(token);
          
          const lastUrl = localStorage.getItem(this.LAST_URL_KEY) || '/tasinmaz-table';
          this.router.navigateByUrl(lastUrl);
          localStorage.removeItem(this.LAST_URL_KEY);
        })
      );
  }

  register(registerUser: RegisterUser): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.post(this.path + 'register', registerUser, { headers: headers });
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.toastr.success('Başarıyla çıkış yapıldı.', 'Çıkış Başarılı');
    this.router.navigateByUrl('/login');
  }

  loggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const isValidToken = token != null && !this.jwtHelper.isTokenExpired(token);
    return isValidToken;
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId(): number | null {
    const token = this.token;
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken['nameid'] || decodedToken['userId'] || null;
  }

  getCurrentUserRole(): string | null {
    const token = this.token;
    if (!token) return null;
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['role'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'Admin';
  }
  
  
}
