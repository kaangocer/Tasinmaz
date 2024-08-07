import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { MapComponent } from '../map/map.component'; 
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-update-tasinmaz',
  templateUrl: './update-tasinmaz.component.html',
  styleUrls: ['./update-tasinmaz.component.css']
})
export class UpdateTasinmazComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent; 

  tasinmaz: any = {};
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIlId: number;
  selectedIlceId: number;
  isAdmin: boolean = false;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getIller();
    this.loadTasinmaz();
    
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

  loadTasinmaz() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.tasinmazService.getTasinmaz(id).subscribe(data => {
      this.tasinmaz = data;
  
      if (this.tasinmaz && this.tasinmaz.mahalle) {
        const mahalle = this.tasinmaz.mahalle;
        this.selectedIlceId = mahalle.ilceId;
        if (mahalle.ilce && mahalle.ilce.il) {
          this.selectedIlId = mahalle.ilce.il.ilId;
        } else {
          console.error('İlçe veya İl bilgisi mevcut değil:', mahalle.ilce);
          this.toastr.error('İlçe veya İl bilgisi bulunamadı.', 'Hata');
        }
  
        // İl ve ilçe bilgilerini al
        this.getIlceByIlId(this.selectedIlId);
        this.getMahallelerByIlceId(this.selectedIlceId);
  
        // Koordinat bilgileri mevcutsa haritayı güncelle
        if (this.tasinmaz.koordinatBilgileri) {
          const coordinates = this.tasinmaz.koordinatBilgileri.split(',').map(Number);
          this.mapComponent.setCenterAndZoom([coordinates[1], coordinates[0]], 10); // [longitude, latitude] formatında
        }
  
      } else {
        console.error('Mahalle bilgisi mevcut değil:', this.tasinmaz);
        this.toastr.error('Mahalle bilgisi bulunamadı.', 'Hata');
      }
    }, error => {
      console.error('Taşınmaz yüklenirken bir hata oluştu:', error);
      this.toastr.error('Taşınmaz yüklenirken bir hata oluştu.', 'Hata');
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
    if (!this.selectedIlId || !this.selectedIlceId || !this.tasinmaz.mahalleId) {
      this.toastr.error('Lütfen tüm alanları doldurun ve seçim yapın.', 'Hata');
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Güncellemek istediğinize emin misiniz?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasinmaz.ilId = this.selectedIlId;
        this.tasinmaz.ilceId = this.selectedIlceId;
  
        this.tasinmazService.updateTasinmaz(this.tasinmaz).subscribe(
          () => {
            this.toastr.success('Taşınmaz başarıyla güncellendi!', 'Başarılı');
            this.router.navigate(['/tasinmaz-list']);
          },
          error => {
            console.error('Taşınmaz güncellenirken hata oluştu:', error);
            this.toastr.error('Taşınmaz güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    });
  }
}
