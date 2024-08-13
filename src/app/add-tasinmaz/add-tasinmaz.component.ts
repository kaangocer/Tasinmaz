import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  isSubmitting = false;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
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
    this.createForm();
    this.getIller();
    const id = this.authService.getCurrentUserId();
    this.tasinmazForm.patchValue({ kullaniciId: id });
    this.isAdmin = this.authService.isAdmin();

    // Koordinat seçme işlevini ayarla
    if (this.mapComponent) {
      this.mapComponent.onCoordinatesSelected = (coordinates: [number, number]) => {
        this.tasinmazForm.patchValue({ koordinatBilgileri: coordinates.join(',') });
      };
    }
  }

  createForm() {
    this.tasinmazForm = this.fb.group({
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatBilgileri: [{ value: '', disabled: true }, Validators.required],
      kullaniciId: [{ value: '', disabled: true }, Validators.required],
      mahalleId: ['', Validators.required],
      ilceId: ['', Validators.required],
      ilId: ['', Validators.required]
    });
  }

  getIller() {
    this.ilService.getIller().subscribe(data => {
      this.iller = data;
    });
  }

  onIlChange() {
    const ilId = this.tasinmazForm.get('ilId').value;
    this.resetIlceAndMahalle();
    if (ilId) {
      this.getIlceByIlId(ilId);
    }
  }

  onIlceChange() {
    const ilceId = this.tasinmazForm.get('ilceId').value;
    this.resetMahalle();
    if (ilceId) {
      this.getMahallelerByIlceId(ilceId);
    }
  }

  resetIlceAndMahalle() {
    this.ilceler = [];
    this.resetMahalle();
  }

  resetMahalle() {
    this.mahalleler = [];
    this.tasinmazForm.patchValue({ mahalleId: null });
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
    if (this.tasinmazForm.valid) {
      // Form değerini elde et
      const formData = {
        ...this.tasinmazForm.value,
        // Koordinat bilgilerini ve kullanıcı ID'yi ekleyin
        koordinatBilgileri: this.tasinmazForm.get('koordinatBilgileri').value,
        kullaniciId: this.authService.getCurrentUserId()
      };
  
      
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { message: 'Taşınmazı eklemek istediğinizden emin misiniz?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isSubmitting = true;
          this.tasinmazService.addTasinmaz(formData).subscribe(
            () => {
              this.toastr.success('Taşınmaz başarıyla eklendi');
              this.router.navigate(['/tasinmaz-list']);
            },
            (error) => {
              console.error('Taşınmaz eklenirken hata oluştu:', error);
              this.toastr.error('Taşınmaz eklenirken hata oluştu');
              this.isSubmitting = false;
            }
          ).add(() => {
            this.isSubmitting = false;
          });
        }
      });
    } else {
      console.error('Form geçersiz');
      this.toastr.error('Formun tüm alanlarını doldurunuz.');
    }
  }
  
}
