// models/DTOs/tasinmaz-dto.ts
export class TasinmazDTO {
  public tasinmazId: number;
  public ada: string;
  public parsel: string;
  public nitelik: string;
  public koordinatBilgileri: string;
  public kullaniciId: number;
  public mahalleId: number;
  public mahalle?: MahalleDTO;
  public ilAd?: string;       // Yeni eklenen alan
  public ilceAd?: string;     // Yeni eklenen alan
  public mahalleAd?: string;  // Yeni eklenen alan
}

export class MahalleDTO {
  public mahalleId: number;
  public mahalleAdi: string;
  public ilceId: number;
  public ilce?: IlceDTO;
}

export class IlceDTO {
  public ilceId: number;
  public ilceAdi: string;
  public ilId: number;
  public il?: IlDTO;
}

export class IlDTO {
  public ilId: number;
  public ilAdi: string;
}
