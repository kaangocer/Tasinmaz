import { Component} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent  {

  constructor(private authService: AuthService, private router: Router,private dialog: MatDialog) { }

 
  logOut() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {

      data: { message: 'Çıkış yapmak istediğinize emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logOut();
        this.router.navigate(['/login']); // Giriş sayfasına yönlendir
      }
    });
  }

}
