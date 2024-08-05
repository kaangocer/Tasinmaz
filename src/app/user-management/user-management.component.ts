import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserManagementService } from '../user-management.service';
import { UserDTO } from '../models/UserDTO'; // UserDTO'yu import edin
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserDTO[] = [];
  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  selectedUser: UserDTO | null = null;
  p: number = 1; // Başlangıç sayfası

  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    // Kullanıcı ekleme formunu oluştur
    this.addUserForm = this.fb.group({
      email: [''],
      password: [''],
      role: ['']
    });

    // Kullanıcı güncelleme formunu oluştur
    this.updateUserForm = this.fb.group({
      email: [''],
      password: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userManagementService.getAllUsers().subscribe(
      (data) => {
        this.users = data.sort((a, b) => {
          if (a.role === 'Admin' && b.role !== 'Admin') return -1;
          if (a.role !== 'Admin' && b.role === 'Admin') return 1;
          return a.kullaniciId - b.kullaniciId;
        });
      },
      (error) => this.toastr.error('Kullanıcıları yüklerken bir hata oluştu.')
    );
  }

  addUser(): void {
    const newUser = this.addUserForm.value as UserDTO;
    if (!newUser.role) {
      newUser.role = 'User';
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Yeni kullanıcı eklensin mi?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.addUser(newUser).subscribe(
          () => {
            this.toastr.success('Kullanıcı başarıyla eklendi.');
            this.loadUsers();
            this.addUserForm.reset();
          },
          (error) => {
            if (error.status === 409) {
              this.toastr.error('Bu email adresi zaten kayıtlı.');
            } else {
              this.toastr.error('Kullanıcıyı eklerken bir hata oluştu.');
            }
          }
        );
      }
    });
  }

  editUser(user: UserDTO): void {
    this.selectedUser = { ...user };
    this.updateUserForm.patchValue(user); // Güncelleme formunu doldur
  }

  updateUser(): void {
    if (!this.selectedUser) {
      this.toastr.error('Formu doğru doldurunuz.');
      return;
    }

    const updatedUser = { ...this.selectedUser, ...this.updateUserForm.value } as UserDTO;
    if (!updatedUser.role) {
      updatedUser.role = 'User';
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Kullanıcı bilgilerini değiştirmek istediğinize emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.updateUser(updatedUser).subscribe(
          () => {
            this.toastr.success('Kullanıcı başarıyla güncellendi.');
            this.loadUsers();
            this.selectedUser = null;
            this.updateUserForm.reset();
          },
          (error) => {
            if (error.status === 409) {
              this.toastr.error('Bu email adresi başka bir kullanıcı tarafından kullanılıyor.');
            } else if (error.status === 404) {
              this.toastr.error('Kullanıcı bulunamadı.');
            } else {
              this.toastr.error('Kullanıcıyı güncellerken bir hata oluştu.');
            }
          }
        );
      }
    });
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Bu kullanıcıyı silmek istediğinize emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.deleteUser(id).subscribe(
          () => {
            this.toastr.success('Kullanıcı başarıyla silindi.');
            this.loadUsers();
          },
          (error) => this.toastr.error('Kullanıcıyı silerken bir hata oluştu.')
        );
      }
    });
  }
}
