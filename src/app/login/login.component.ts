import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { LoginUser } from '../models/loginUser';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder, // FormBuilder injected
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Kullanıcı zaten giriş yapmışsa, son ziyaret ettiği sayfaya yönlendir
    if (this.authService.loggedIn()) {
      const lastUrl = localStorage.getItem(this.authService.LAST_URL_KEY) || '/tasinmaz-table';
      this.router.navigateByUrl(lastUrl);
    }

    this.loginForm = this.fb.group({
      email: [''], // Email kontrolü yapılmıyor
      password: ['', Validators.required] // Şifre kontrolü zorunlu
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      const loginUser: LoginUser = this.loginForm.value;
      this.authService.login(loginUser).subscribe(
        (response) => {
          
          
          this.toastr.success("Başarıyla giriş yaptınız!", "Başarılı");
          const lastUrl = localStorage.getItem(this.authService.LAST_URL_KEY) || '/tasinmaz-table';
          this.router.navigateByUrl(lastUrl);
        },
        (error) => {
         
          
          this.toastr.error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.", "Hata");
        }
      );
    }
  }

  openRegisterPopup(): void {
    this.dialog.open(RegisterPopupComponent, {
      width: '400px',
    });
  }
}
