import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IlService } from '../../services/ilServices/il.service';
import { IlceService } from '../../services/ilceServices/ilce.service';
import { MahalleService } from '../../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Map2Component } from '../map2/map2.component';
import { AuthService } from '../auth.service';
import { TasinmazDTO, IlDTO, IlceDTO, MahalleDTO } from '../../models/DTOs/tasinmaz-dto';
import { ExportService } from '../../services/otherServices/export.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tasinmaz-table',
  templateUrl: './tasinmaz-table.component.html',
  styleUrls: ['./tasinmaz-table.component.css']
})
export class TasinmazTableComponent implements OnInit {
  @ViewChild(Map2Component) mapComponent: Map2Component;
  tasinmazlar: TasinmazDTO[] = [];
  iller: IlDTO[] = [];
  ilceler: IlceDTO[] = [];
  mahalleler: MahalleDTO[] = [];
  selectedTasinmazlar: TasinmazDTO[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  filterForm: FormGroup;
  lastCheckedTasinmaz: TasinmazDTO;

  constructor(
    private fb: FormBuilder,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private tasinmazService: TasinmazService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private exportService: ExportService,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      ilAd: [''],
      ilceAd: [''],
      mahalleAd: [''],
      ada: [''],
      parsel: [''],
      nitelik: [''],
      kullaniciId: ['']
    });
  }

  ngOnInit(): void {
    this.getTasinmazlar();
  }

  getTasinmazlar() {
    const userRole = this.authService.getCurrentUserRole();
  
    if (userRole === 'Admin') {
      this.tasinmazService.getAllProperties(this.filterForm.value).subscribe(
        tasinmazData => {
          this.tasinmazlar = tasinmazData;
          this.getIller();
          
          // Admin kullanıcıları için taşınmazları haritada göster
          if (this.mapComponent) {
            this.mapComponent.tasinmazlar = tasinmazData; // Map2Component için taşınmazları ilet
            this.mapComponent.addMarkers(); // Haritada tüm taşınmazları göster
          }
        },
        error => {
          this.toastr.error('Taşınmazlar getirilirken bir hata oluştu.', 'Hata');
        }
      );
    } else {
      const id = this.authService.getCurrentUserId();
      this.tasinmazService.getTasinmazByKullaniciId(id, this.filterForm.value).subscribe(
        tasinmazData => {
          this.tasinmazlar = tasinmazData;
          this.getIller();
        },
        error => {
          this.toastr.error('Taşınmazlar getirilirken bir hata oluştu.', 'Hata');
        }
      );
    }
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

  toggleSelection(tasinmaz: TasinmazDTO) {
    const index = this.selectedTasinmazlar.indexOf(tasinmaz);

    if (index === -1) {
      this.selectedTasinmazlar.push(tasinmaz);
      this.lastCheckedTasinmaz = tasinmaz;
    } else {
      this.selectedTasinmazlar.splice(index, 1);
      this.lastCheckedTasinmaz = null;
    }

    if (this.lastCheckedTasinmaz) {
      const koordinatBilgileri = this.lastCheckedTasinmaz.koordinatBilgileri.split(',').map(parseFloat);
      this.mapComponent.setCenterAndZoom([koordinatBilgileri[1], koordinatBilgileri[0]], 10);
    }
  }

  isSelected(tasinmaz: TasinmazDTO): boolean {
    return this.selectedTasinmazlar.includes(tasinmaz);
  }

  deleteSelected() {
    if (this.selectedTasinmazlar.length === 0) {
      this.toastr.warning('Lütfen silmek için taşınmaz seçin.', 'Uyarı');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Silmek istediğinize emin misiniz?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedTasinmazlar.forEach(tasinmaz => {
          this.tasinmazService.deleteTasinmaz(tasinmaz.tasinmazId).subscribe(
            () => {
              this.toastr.success('Taşınmaz(lar) başarıyla silindi.', 'Başarılı');
              this.getTasinmazlar();
              this.selectedTasinmazlar = [];
            },
            error => {
              this.toastr.error('Taşınmaz(lar) silinirken bir hata oluştu.', 'Hata');
            }
          );
        });
      }
    });
  }

  navigateToUpdate() {
    if (this.selectedTasinmazlar.length !== 1) {
      this.toastr.error('Güncellemek için yalnızca bir taşınmaz seçin.', 'Hata');
      return;
    }

    const selectedItemId = this.selectedTasinmazlar[0].tasinmazId;
    this.router.navigate([`/update-tasinmaz/${selectedItemId}`]).then(success => {
      // İsteğe bağlı işlemler
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  exportToExcel(): void {
    
    const filteredData = this.tasinmazlar.map(item => {
      return {
        
        ada: item.ada,
        parsel: item.parsel,
        nitelik: item.nitelik,
        koordinatBilgileri: item.koordinatBilgileri,
        ilId: item.ilAd,
        ilceId: item.ilceAd,
        mahalleId: item.mahalleAd
      };
    });
  
    
    this.exportService.exportToExcel(filteredData, 'tasinmazlar');
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUserRole() === 'Admin';
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const userRole = this.authService.getCurrentUserRole();

    if (userRole === 'Admin') {
      this.tasinmazService.getAllProperties(filters).subscribe(tasinmazData => {
        this.tasinmazlar = tasinmazData;
        this.getIller();
        this.selectedTasinmazlar = [];
        if (this.mapComponent) {
          this.mapComponent.tasinmazlar = tasinmazData;
          this.mapComponent.addMarkers();
        }
      }, error => {
        this.toastr.error('Taşınmazlar getirilirken bir hata oluştu.', 'Hata');
      });
    } else {
      const id = this.authService.getCurrentUserId();
      this.tasinmazService.getTasinmazByKullaniciId(id, filters).subscribe(tasinmazData => {
        this.tasinmazlar = tasinmazData;
        this.selectedTasinmazlar = [];
        this.getIller();
      }, error => {
        this.toastr.error('Taşınmazlar getirilirken bir hata oluştu.', 'Hata');
      });
    }
  }
}
