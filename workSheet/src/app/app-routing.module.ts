import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddworksheetComponent } from './components/addworksheet/addworksheet.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyworksheetComponent } from './components/myworksheet/myworksheet.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth/auth.guard';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { TemplatesComponent } from './components/templates/templates.component';

const routes: Routes = [
  { path: '', redirectTo: 'worksheets', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidenav', component: SidenavComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'add-worksheet', component: AddworksheetComponent, canActivate: [AuthGuard] },
  { path: 'worksheets', component: MyworksheetComponent, canActivate: [AuthGuard] },
  { path: 'add-template', component: AddTemplateComponent, canActivate: [AuthGuard] },
  { path: 'templates', component: TemplatesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
