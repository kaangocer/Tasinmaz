// log-reporting.component.ts
import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-log-reporting',
  templateUrl: './log-reporting.component.html',
  styleUrls: ['./log-reporting.component.css']
})
export class LogReportingComponent implements OnInit {
  filter: any = {};
  logs: any[] = [];

  constructor(private logService: LogService, private toastr: ToastrService,private exportService: ExportService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.logService.getLogs(this.filter).subscribe(
      data => this.logs = data,
      error => this.toastr.error('Log kayıtları alınırken bir hata oluştu.', 'Hata')
    );
  }

  onFilter(): void {
    this.fetchLogs();
  }

  exportToExcel(): void {
    // Verileri Excel formatında dışa aktar
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
