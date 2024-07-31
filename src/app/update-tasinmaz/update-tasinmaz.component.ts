import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-tasinmaz',
  templateUrl: './update-tasinmaz.component.html',
  styleUrls: ['./update-tasinmaz.component.css']
})
export class UpdateTasinmazComponent implements OnInit {
  tasinmaz: any = {};
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIlId: number;
  selectedIlceId: number;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getIller();
    this.loadTasinmaz();
  }

  getIller() {
    this.ilService.getIller().subscribe(data => {
      this.iller = data;
    });
  }

  loadTasinmaz() {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.tasinmazService.getTasinmaz(id).subscribe(data => {
      this.tasinmaz = data;
      if (this.tasinmaz) {
        if (this.tasinmaz.mahalle && this.tasinmaz.mahalle.ilce && this.tasinmaz.mahalle.ilce.il) {
          this.selectedIlId = this.tasinmaz.mahalle.ilce.il.ilId;
          this.selectedIlceId = this.tasinmaz.mahalle.ilce.ilceId;
          this.getIlceByIlId(this.selectedIlId);
          this.getMahallelerByIlceId(this.selectedIlceId);
        } else {
          console.error('Taşınmaz verisi eksik:', this.tasinmaz);
          this.toastr.error('Taşınmaz verileri eksik.', 'Hata');
        }
      } else {
        console.error('Taşınmaz verisi bulunamadı:', data);
        this.toastr.error('Taşınmaz verisi bulunamadı.', 'Hata');
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
    // Checkboxların seçildiğini kontrol et
    if (!this.selectedIlId || !this.selectedIlceId || !this.tasinmaz.mahalleId) {
      this.toastr.error('Lütfen tüm alanları doldurun ve seçim yapın.', 'Hata');
      return;
    }
  
    this.tasinmazService.updateTasinmaz(this.tasinmaz).subscribe(
      () => {
        this.toastr.success('Taşınmaz başarıyla güncellendi!', 'Başarılı');
        this.router.navigate(['/tasinmaz-table']);
      },
      error => {
        this.toastr.error('Lütfen tüm alanları doldurun ve seçim yapın.', 'Hata');
      }
    );
  }
}
