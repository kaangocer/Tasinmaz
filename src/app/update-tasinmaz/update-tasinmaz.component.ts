import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { MapComponent } from '../map/map.component'; // Harita bileşeni import edilmiştir

@Component({
  selector: 'app-update-tasinmaz',
  templateUrl: './update-tasinmaz.component.html',
  styleUrls: ['./update-tasinmaz.component.css']
})
export class UpdateTasinmazComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent; // Harita bileşeni referansı

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
    private authService: AuthService
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
      if (this.tasinmaz) {
        this.selectedIlId = this.tasinmaz.ilId;
        this.selectedIlceId = this.tasinmaz.ilceId;
        this.getIlceByIlId(this.selectedIlId);
        this.getMahallelerByIlceId(this.selectedIlceId);
        // Koordinatları harita merkezine yerleştir
        if (this.tasinmaz.koordinatBilgileri) {
          const coordinates = this.tasinmaz.koordinatBilgileri.split(',').map(Number);
          this.mapComponent.setCenterAndZoom([coordinates[1], coordinates[0]], 10); // [longitude, latitude] formatında
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
}
