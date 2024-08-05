import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
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

  emailDomainValidator(control: FormControl) {
    const validDomains = ['hotmail.com', 'gmail.com'];
    const email = control.value;

    if (!email) return null;

    const domain = email.substring(email.lastIndexOf('@') + 1);
    return validDomains.includes(domain) ? null : { invalidDomain: true };
  }

  passwordStrengthValidator(control: FormControl) {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[+!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    return !valid ? { strongPassword: true } : null;
  }

  register() {
    if (this.registerForm.invalid) {
      this.toastr.error('Formunuz eksik veya hatalı!', 'Kayıt Başarısız');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('Kayıt başarılı!', 'Başarılı');
        this.dialogRef.close();
      },
      error: (error) => {
        this.toastr.error('Kayıt başarısız. Lütfen tekrar deneyin.', 'Hata');
        console.error('Kayıt hatası:', error);
      }
    });
  }
}
