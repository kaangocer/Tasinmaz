import { Component, OnInit, ViewChild } from '@angular/core';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tasinmaz-table',
  templateUrl: './tasinmaz-table.component.html',
  styleUrls: ['./tasinmaz-table.component.css']
})
export class TasinmazTableComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent;
  tasinmazlar: any[] = [];
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedTasinmaz: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getTasinmazlar();
  }

  getTasinmazlar() {
    const id =this.authService.getCurrentUserId();
    console.log(id);
    this.tasinmazService.getTasinmazByKullaniciId(id).subscribe(tasinmazData => {
      this.tasinmazlar = tasinmazData;
      this.getIller();
    });
  }
  

  getIller() {
    this.ilService.getIller().subscribe(ilData => {
      this.iller = ilData;
      this.getIlceler();
    });
  }

  getIlceler() {
    this.ilceService.getIlceler().subscribe(ilceData => {
      this.ilceler = ilceData;
      this.getMahalleler();
    });
  }

  getMahalleler() {
    this.mahalleService.getMahalleler().subscribe(mahalleData => {
      this.mahalleler = mahalleData;
      this.mergeData();
    });
  }

  mergeData() {
    this.tasinmazlar.forEach(tasinmaz => {
      const mahalle = this.mahalleler.find(m => m.mahalleId === tasinmaz.mahalleId);
      if (mahalle && mahalle.ilce) {
        const ilce = this.ilceler.find(i => i.ilceId === mahalle.ilce.ilceId);
        const il = this.iller.find(il => il.ilId === ilce.il.ilId);
        tasinmaz.ilAd = il ? il.ilAdi : null;
        tasinmaz.ilceAd = ilce ? ilce.ilceAdi : null;
        tasinmaz.mahalleAd = mahalle ? mahalle.mahalleAdi : null;
      }
    });
    this.tasinmazlar.sort((a, b) => a.tasinmazId - b.tasinmazId);
  }

  toggleSelection(tasinmaz: any) {
    if (this.selectedTasinmaz === tasinmaz) {
      this.selectedTasinmaz = null; // Unselect if already selected
    } else {
      this.selectedTasinmaz = tasinmaz; // Select new item
    }

    if (this.selectedTasinmaz) {
      const koordinatBilgileri = this.selectedTasinmaz.koordinatBilgileri.split(',').map(parseFloat);
      this.mapComponent.setCenterAndZoom([koordinatBilgileri[1], koordinatBilgileri[0]], 10);
    }
  }

  isSelected(tasinmaz: any): boolean {
    return this.selectedTasinmaz === tasinmaz;
  } 

  deleteSelected() {
    const selectedTasinmaz = this.selectedTasinmaz; // Seçili taşınmazı al
    if (!selectedTasinmaz) {
      this.toastr.warning('Lütfen silmek için bir taşınmaz seçin.', 'Uyarı');
      return;
    }

    this.tasinmazService.deleteTasinmaz(selectedTasinmaz.tasinmazId).subscribe(
      () => {
        this.toastr.success('Taşınmaz başarıyla silindi.', 'Başarılı');
        this.getTasinmazlar(); // Tabloyu yenile
        this.selectedTasinmaz = null; // Seçimi temizle
      },
      error => {
        this.toastr.error('Taşınmaz silinirken bir hata oluştu.', 'Hata');
      }
    );
  }

  navigateToUpdate() {
    if (!this.selectedTasinmaz) {
      this.toastr.error('Güncellemek için bir taşınmaz seçin.', 'Hata');
      return;
    }
    
    const selectedItemId = this.selectedTasinmaz.tasinmazId;
    console.log("Yönlendiriliyor:", `/update-tasinmaz/${selectedItemId}`);
    this.router.navigate([`/update-tasinmaz/${selectedItemId}`]).then(success => {
      if (success) {
        console.log("Başarıyla yönlendirildi.");
      } else {
        console.log("Yönlendirme başarısız.");
      }
    });
  }
  

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
