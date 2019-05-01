import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRegisterResponse } from 'src/app/models/register/register-response';
import { IRegister } from 'src/app/models/register/register';
import { ILogin } from 'src/app/models/login/login';
import { ILoginResponse } from 'src/app/models/login/login-response';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'http://localhost:3000/users/';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  registerUser(user: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this.URL + 'register', user);
  }

  loginUser(user: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.URL + 'authenticate', user);
  }

  logoutUser(): void {
    this.tokenService.deleteTokenWithData();
    this.router.navigate(['/login']);
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL}usernameAvailability?username=${username}`, {
      headers: new HttpHeaders({
        'Authorization': this.tokenService.getToken()
      })
    });
  }

}
