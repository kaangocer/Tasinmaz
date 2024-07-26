import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-popup',
  templateUrl: './register-popup.component.html',
  styleUrls: ['./register-popup.component.css']
})
export class RegisterPopupComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<RegisterPopupComponent>,
    private toastr: ToastrService // ToastrService ekledik
  ) {
    this.registerForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { mismatch: true }
      : null;
  }

  register() {
    if (this.registerForm.invalid) {
      this.toastr.error('Formunuz eksik veya hatalı!', 'Kayıt Başarısız');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('Kayıt başarılı!', 'Başarılı');
        this.dialogRef.close(); // Popup'ı kapat
      },
      error: (error) => {
        this.toastr.error('Kayıt başarısız. Lütfen tekrar deneyin.', 'Hata');
        console.error('Kayıt hatası:', error);
      }
    });
  }
}
