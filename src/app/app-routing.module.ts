import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasinmazTableComponent } from './tasinmaz-table/tasinmaz-table.component';
import { AddTasinmazComponent } from './add-tasinmaz/add-tasinmaz.component';
import { UpdateTasinmazComponent } from './update-tasinmaz/update-tasinmaz.component';

const routes: Routes = [{path:'tasinmaz-table',component: TasinmazTableComponent},
  {path:'add-tasinmaz',component: AddTasinmazComponent},
  {path:'',redirectTo:'tasinmaz-table',pathMatch: 'full'},
  {path: 'update-tasinmaz/:id', component: UpdateTasinmazComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
