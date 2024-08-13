import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

   canActivate(): boolean {
    if (this.authService.loggedIn()) {
      // Kullanıcı giriş yapmışsa, yönlendirmeye devam et
      return true;
    } else {
      // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
      this.router.navigate(['/login']);
      return false;
    }
  }
}
