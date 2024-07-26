import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { LoginUser } from '../models/loginUser';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser: LoginUser = { Email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Kullanıcı zaten giriş yapmışsa, son ziyaret ettiği sayfaya yönlendir
    if (this.authService.loggedIn()) {
      const lastUrl = localStorage.getItem(this.authService.LAST_URL_KEY) || '/tasinmaz-table';
      this.router.navigateByUrl(lastUrl);
    }
  }

  login() {
    this.authService.login(this.loginUser);
  }

  openRegisterPopup(): void {
    this.dialog.open(RegisterPopupComponent, {
      width: '400px',
    });
  }
}
