import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRegisterResponse } from 'src/app/models/register/register-response';
import { IRegister } from 'src/app/models/register/register';
import { ILogin } from 'src/app/models/login/login';

import { delay } from 'rxjs/operators';
import { ILoginResponse } from 'src/app/models/login/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API route to manage user
  URL = '/api/users/';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  // Calls register user with register data
  registerUser(user: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this.URL + 'register', user);
  }

  // Call login user with user credentials
  // Returns observable of ILogin
  loginUser(user: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.URL + 'authenticate', user);
  }

  // Calls token service to delete token with data
  // Navigates browser to login route
  logoutUser(): void {
    this.tokenService.deleteTokenWithData();
    this.router.navigate(['/login']);
  }

  // Calls email availability function on backend with email in paramter every 1 second
  isEmailAvailable(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL}emailAvailability?email=${email}`, {
      headers: new HttpHeaders({
        'Authorization': this.tokenService.getToken()
      })
    }).pipe(
      delay(1000)
    );
  }

}
