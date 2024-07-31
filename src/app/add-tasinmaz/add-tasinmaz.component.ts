import { Component, OnInit } from '@angular/core';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-tasinmaz',
  templateUrl: './add-tasinmaz.component.html',
  styleUrls: ['./add-tasinmaz.component.css']
})
export class AddTasinmazComponent implements OnInit {
  tasinmaz: any = {};
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  filteredIlceler: any[] = [];
  filteredMahalleler: any[] = [];
  selectedIlId: number;
  selectedIlceId: number;
  isSubmitting = false;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private router: Router,
    private toastr: ToastrService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.getIller();
    var id = this.authService.getCurrentUserId();
    this.tasinmaz.kullaniciId = id;
  }

  getIller() {
    this.ilService.getIller().subscribe(data => {
      this.iller = data;
    });
  }

  onIlChange() {
    // İl değiştiğinde ilçe ve mahalle değerlerini sıfırla
    this.selectedIlceId = null;
    this.resetIlceAndMahalle();
    if (this.selectedIlId) {
      this.getIlceByIlId(this.selectedIlId);
    }
  }

  onIlceChange() {
    // İlçe değiştiğinde mahalle değerini sıfırla ve yeni ilçeye ait mahalleleri getir
    this.resetMahalle();
    if (this.selectedIlceId) {
      this.getMahallelerByIlceId(this.selectedIlceId);
    }
  }

  resetIlceAndMahalle() {
    this.ilceler = [];
    this.filteredIlceler = [];
    this.resetMahalle();
  }

  resetMahalle() {
    this.mahalleler = [];
    this.filteredMahalleler = [];
    this.tasinmaz.mahalleId = null;
  }

  getIlceByIlId(ilId: number) {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(data => {
      this.ilceler = data;
      this.filteredIlceler = data;
    });
  }

  getMahallelerByIlceId(ilceId: number) {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(data => {
      this.mahalleler = data;
      this.filteredMahalleler = data;
    });
  }

  onSubmit() {
    // Eğer işlem zaten yapılıyorsa, bu işlemi durdur
    if (this.isSubmitting) return;

    // Form verilerini kontrol et
    if (!this.selectedIlId || !this.selectedIlceId || !this.tasinmaz.mahalleId) {
      this.toastr.error('Lütfen tüm alanları doldurun ve seçim yapın.', 'Hata');
      return;
    }

    // İşlem başladığını belirt
    this.isSubmitting = true;

    this.tasinmazService.addTasinmaz(this.tasinmaz).subscribe(
      () => {
        this.toastr.success('Taşınmaz başarıyla eklendi!', 'Başarılı');
        this.router.navigate(['/tasinmaz-table']);
      },
      error => {
        this.toastr.error('Taşınmaz eklenirken bir hata oluştu.', 'Hata');
      },
      () => {
        // İşlem tamamlandığında butonu tekrar aktif hale getir
        this.isSubmitting = false;
      }
    );
  }
  
}
