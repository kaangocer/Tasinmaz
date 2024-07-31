import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Log verilerini Excel formatında dışa aktarır
  exportToExcel(data: any[], fileName: string): void {
    // JSON verilerini Excel sayfasına dönüştür
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    // Workbook oluştur ve sayfa ekle
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // Excel dosyasını binary dizi olarak yaz
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Dosyayı indir
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    // Dosyayı Blob olarak oluştur
    const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    // Dosyayı kaydet
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}
