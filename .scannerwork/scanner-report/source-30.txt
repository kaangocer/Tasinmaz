import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LogService } from '../log.service';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-log-reporting',
  templateUrl: './log-reporting.component.html',
  styleUrls: ['./log-reporting.component.css']
})
export class LogReportingComponent implements OnInit {
  filterForm: FormGroup; // Reactive form tanımı
  logs: any[] = [];
  p: number = 1;
  pageSize: number = 15;

  constructor(
    private fb: FormBuilder, // FormBuilder enjekte ediliyor
    private logService: LogService,
    private toastr: ToastrService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchLogs();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      kullaniciId: [''],
      durumId: [''],
      islemTipId: [''],
      aciklama: [''],
      tarihSaat: [''],
      kullaniciIp: [''] // Eklenen alan
    });
  }

  fetchLogs(): void {
    this.logService.getLogs(this.filterForm.value).subscribe(
      data => {
      
        this.logs = data.sort((a, b) => new Date(b.tarihSaat).getTime() - new Date(a.tarihSaat).getTime());
      },
      error => this.toastr.error('Log kayıtları alınırken bir hata oluştu.', 'Hata')
    );
  }
  
  

  onFilter(): void {
    this.fetchLogs();
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.logs, 'log-kayitlari');
    this.toastr.success('Log kayıtları başarıyla dışa aktarıldı!', 'Başarılı');
  }

  getDurum(durumId: number): string {
    switch (durumId) {
      case 1: return 'Başarılı';
      case 2: return 'Başarısız';
      default: return 'Bilinmeyen';
    }
  }

  getIslemTip(islemTipId: number): string {
    switch (islemTipId) {
      case 1: return 'Yeni Kayıt';
      case 2: return 'Güncelleme';
      case 3: return 'Silme';
      case 4: return 'Giriş';
      default: return 'Bilinmeyen';
    }
  }
}
