import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterializeModule } from 'angular2-materialize';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddworksheetComponent } from './components/addworksheet/addworksheet.component';
import { LoginComponent } from './components/login/login.component';
import { MyworksheetComponent } from './components/myworksheet/myworksheet.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { TokenService } from './services/token/token.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastService } from './services/toast/toast.service';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { UserValidator } from './validators/user/user.validator';
import { SheetComponent } from './components/sheet/sheet.component';
import { TemplateComponent } from './components/template/template.component';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AddworksheetComponent,
    LoginComponent,
    MyworksheetComponent,
    ProfileComponent,
    RegisterComponent,
    NavbarComponent,
    AddTemplateComponent,
    TemplatesComponent,
    SheetComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterializeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['example.com'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    TokenService,
    UserService,
    ToastService,
    UserValidator
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
