import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TasinmazTableComponent } from './tasinmaz-table/tasinmaz-table.component';
import { AddTasinmazComponent } from './add-tasinmaz/add-tasinmaz.component';
import { HttpClientModule } from '@angular/common/http';
import { IlService } from '../services/ilServices/il.service';
import { IlceService } from '../services/ilceServices/ilce.service';
import { MahalleService } from '../services/mahalleServices/mahalle.service';
import { TasinmazService } from '../services/tasinmazServices/tasinmaz.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UpdateTasinmazComponent } from './update-tasinmaz/update-tasinmaz.component';
import { MapComponent } from './map/map.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TasinmazTableComponent,
   
    AddTasinmazComponent,
   
    UpdateTasinmazComponent,
   
    MapComponent,
    
    

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // Toastr için gerekli
    ToastrModule.forRoot() // Toastr modülünü ekleyin
  ],
  providers: [IlService,
    IlceService,
    MahalleService,
    TasinmazService],
  bootstrap: [AppComponent]
})
export class AppModule { }
