import { Component, OnInit, ViewChild } from '@angular/core';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { MapComponent } from '../map/map.component'; // Harita bileşeni import edilmiştir
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-tasinmaz',
  templateUrl: './add-tasinmaz.component.html',
  styleUrls: ['./add-tasinmaz.component.css']
})
export class AddTasinmazComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent; // Harita bileşeni referansı

  tasinmaz: any = {};
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIlId: number;
  selectedIlceId: number;
  isSubmitting = false;
  isAdmin: boolean = false;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getIller();
    const id = this.authService.getCurrentUserId();
    this.tasinmaz.kullaniciId = id;
    this.isAdmin = this.authService.isAdmin();

    // Koordinat seçme işlevini ayarla
    if (this.mapComponent) {
      this.mapComponent.onCoordinatesSelected = (coordinates: [number, number]) => {
        this.tasinmaz.koordinatBilgileri = coordinates.join(',');
      };
    }
  }

  getIller() {
    this.ilService.getIller().subscribe(data => {
      this.iller = data;
    });
  }

  onIlChange() {
    this.selectedIlceId = null;
    this.resetIlceAndMahalle();
    if (this.selectedIlId) {
      this.getIlceByIlId(this.selectedIlId);
    }
  }

  onIlceChange() {
    this.resetMahalle();
    if (this.selectedIlceId) {
      this.getMahallelerByIlceId(this.selectedIlceId);
    }
  }

  resetIlceAndMahalle() {
    this.ilceler = [];
    this.resetMahalle();
  }

  resetMahalle() {
    this.mahalleler = [];
    this.tasinmaz.mahalleId = null;
  }

  getIlceByIlId(ilId: number) {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(data => {
      this.ilceler = data;
    });
  }

  getMahallelerByIlceId(ilceId: number) {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(data => {
      this.mahalleler = data;
    });
  }

  onSubmit() {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Taşınmazı eklemek istediğinizden emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isSubmitting = true;
        this.tasinmazService.addTasinmaz(this.tasinmaz).subscribe(
          () => {
            this.toastr.success('Taşınmaz başarıyla eklendi');
            this.router.navigate(['/tasinmaz-list']);
          },
          (error) => {
            console.error('Taşınmaz eklenirken hata oluştu:', error);
            this.toastr.error('Taşınmaz eklenirken hata oluştu');
            this.isSubmitting = false;
          }
        );
      }
    });
  }

}
