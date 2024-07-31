// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';
import { UserDTO } from '../models/UserDTO'; // UserDTO'yu import edin
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserDTO[] = [];
  newUser: UserDTO = { email: '', password: '', role: '' };
  selectedUser: UserDTO | null = null;
  p: number = 1; // Başlangıç sayfası
  constructor(
    private userManagementService: UserManagementService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userManagementService.getAllUsers().subscribe(
      (data) => {
        this.users = data
          .sort((a, b) => {
            // Admin kullanıcılar önce gelsin
            if (a.role === 'Admin' && b.role !== 'Admin') {
              return -1;
            }
            if (a.role !== 'Admin' && b.role === 'Admin') {
              return 1;
            }
            // Eğer rol aynıysa KullaniciId'ye göre sırala
            return a.kullaniciId - b.kullaniciId;
          });
      },
      (error) => this.toastr.error('Kullanıcıları yüklerken bir hata oluştu.')
    );
  }

  addUser(): void {
    // Email ve şifre boş mu kontrol et
    if (!this.newUser.email || !this.newUser.password) {
      this.toastr.error('Email ve şifre boş olamaz.');
      return;
    }

    // Rol boşsa "User" olarak ata
    if (!this.newUser.role) {
      this.newUser.role = 'User';
    }

    this.userManagementService.addUser(this.newUser).subscribe(
      () => {
        this.toastr.success('Kullanıcı başarıyla eklendi.');
        this.loadUsers(); // Kullanıcıları yeniden yükle
        this.newUser = { email: '', password: '', role: '' }; // Formu sıfırla
      },
      (error) => {
        if (error.status === 409) {
          // 409 Conflict hatası aldığımızda kullanıcıya bilgi ver
          this.toastr.error('Bu email adresi zaten kayıtlı.');
        } else {
          this.toastr.error('Kullanıcıyı eklerken bir hata oluştu.');
        }
      }
    );
  }


  editUser(user: UserDTO): void {
    this.selectedUser = { ...user }; // Seçilen kullanıcıyı düzenleme için ayarla
  }

  updateUser(): void {
    if (this.selectedUser) {
      // Email boş olamaz
      if (!this.selectedUser.email) {
        this.toastr.error('Email boş olamaz.');
        return;
      }
  
      // Password boşsa önceki passwordu koru
      if (!this.selectedUser.password) {
        this.selectedUser.password = ''; // Eski şifreyi korumak için backend bu alanı yok saymalı
      }
  
      // Role boşsa "User" olarak ata
      if (!this.selectedUser.role) {
        this.selectedUser.role = 'User';
      }
  
      this.userManagementService.updateUser(this.selectedUser).subscribe(
        () => {
          this.toastr.success('Kullanıcı başarıyla güncellendi.');
          this.loadUsers(); // Kullanıcıları yeniden yükle
          this.selectedUser = null; // Düzenleme formunu kapat
        },
        (error) => {
          if (error.status === 409) {
            this.toastr.error('Bu email adresi başka bir kullanıcı tarafından kullanılıyor.');
          } else if (error.status === 404) {
            this.toastr.error('Kullanıcı bulunamadı.');
          } else {
            console.error('Kullanıcıyı güncellerken bir hata oluştu:', error);
            this.toastr.error('Kullanıcıyı güncellerken bir hata oluştu.');
          }
        }
      );
    }
  }
  

  deleteUser(id: number): void {
    this.userManagementService.deleteUser(id).subscribe(
      () => {
        this.toastr.success('Kullanıcı başarıyla silindi.');
        this.loadUsers(); // Kullanıcıları yeniden yükle
      },
      (error) => this.toastr.error('Kullanıcıyı silerken bir hata oluştu.')
    );
  }
}