import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasinmazTableComponent } from './tasinmaz-table/tasinmaz-table.component';
import { AddTasinmazComponent } from './add-tasinmaz/add-tasinmaz.component';
import { UpdateTasinmazComponent } from './update-tasinmaz/update-tasinmaz.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminGuard } from './admin.guard';
import { LogReportingComponent } from './log-reporting/log-reporting.component';

const routes: Routes = [{ path: 'tasinmaz-table', component: TasinmazTableComponent, canActivate: [AuthGuard] },
{ path: 'user-management', component: UserManagementComponent, canActivate: [AdminGuard] },  
{ path: 'log-reporting', component: LogReportingComponent, canActivate: [AdminGuard] },
{path:'add-tasinmaz',component: AddTasinmazComponent, canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'update-tasinmaz/:id', component: UpdateTasinmazComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
