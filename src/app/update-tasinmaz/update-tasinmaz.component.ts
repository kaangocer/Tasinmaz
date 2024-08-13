import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  updateForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  isAdmin: boolean = false;
  isSubmitting: boolean = false;
  tasinmazId: number;
  kullaniciId: number;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tasinmazId = +this.route.snapshot.paramMap.get('id'); // ID'yi route'dan al
    this.kullaniciId = this.authService.getCurrentUserId(); // O anki kullanıcı ID'sini al
    this.initializeForm();
    this.getIller();
    this.loadTasinmaz();
    
    // Koordinat seçme işlevini ayarla
    if (this.mapComponent) {
      this.mapComponent.onCoordinatesSelected = (coordinates: [number, number]) => {
        this.updateForm.patchValue({
          koordinatBilgileri: coordinates.join(',')
        });
      };
    }
  }

  initializeForm() {
    this.updateForm = this.fb.group({
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatBilgileri: [''],
      ilId: [null, Validators.required],
      ilceId: [null, Validators.required],
      mahalleId: [null, Validators.required],
      kullaniciId: [{ value: this.kullaniciId, disabled: true }] // Kullanıcı ID'sini formda ayarla
    });
  }

  getIller() {
    this.ilService.getIller().subscribe(data => {
      this.iller = data;
    });
  }

  loadTasinmaz() {
    this.tasinmazService.getTasinmaz(this.tasinmazId).subscribe(data => {
      this.updateForm.patchValue(data);

      if (data && data.mahalle) {
        const mahalle = data.mahalle;
        this.updateForm.patchValue({
          ilceId: mahalle.ilceId,
          mahalleId: mahalle.mahalleId,
          ilId: mahalle.ilce.ilId
        });

        // İl ve ilçe bilgilerini al
        this.getIlceByIlId(mahalle.ilce.ilId);
        this.getMahallelerByIlceId(mahalle.ilce.ilceId);

        // Koordinat bilgileri mevcutsa haritayı güncelle
        if (data.koordinatBilgileri) {
          const coordinates = data.koordinatBilgileri.split(',').map(Number);
          this.mapComponent.setCenterAndZoom([coordinates[1], coordinates[0]], 10); // [longitude, latitude] formatında
        }
      } else {
        console.error('Mahalle bilgisi mevcut değil:', data);
        this.toastr.error('Mahalle bilgisi bulunamadı.', 'Hata');
      }
    }, error => {
      console.error('Taşınmaz yüklenirken bir hata oluştu:', error);
      this.toastr.error('Taşınmaz yüklenirken bir hata oluştu.', 'Hata');
    });
  }

  onIlChange() {
    this.updateForm.patchValue({
      ilceId: null,
      mahalleId: null
    });
    this.resetIlceAndMahalle();
    if (this.updateForm.get('ilId').value) {
      this.getIlceByIlId(this.updateForm.get('ilId').value);
    }
  }

  onIlceChange() {
    this.resetMahalle();
    if (this.updateForm.get('ilceId').value) {
      this.getMahallelerByIlceId(this.updateForm.get('ilceId').value);
    }
  }

  resetIlceAndMahalle() {
    this.ilceler = [];
    this.resetMahalle();
  }

  resetMahalle() {
    this.mahalleler = [];
    this.updateForm.patchValue({
      mahalleId: null
    });
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
    if (this.updateForm.invalid) {
      this.toastr.error('Lütfen tüm alanları doldurun ve seçim yapın.', 'Hata');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Güncellemek istediğinize emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isSubmitting = true;
        this.tasinmazService.updateTasinmaz({
          ...this.updateForm.value,
          tasinmazId: this.tasinmazId,
          kullaniciId: this.kullaniciId // Kullanıcı ID'sini gönder
        }).subscribe(
          () => {
            this.toastr.success('Taşınmaz başarıyla güncellendi!', 'Başarılı');
            this.router.navigate(['/tasinmaz-list']);
          },
          error => {
            console.error('Taşınmaz güncellenirken hata oluştu:', error);
            this.toastr.error('Taşınmaz güncellenirken bir hata oluştu.', 'Hata');
          }
        ).add(() => this.isSubmitting = false);
      }
    });
  }
}
