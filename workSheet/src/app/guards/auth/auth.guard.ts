import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenService } from 'src/app/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Calls token service for checking experation of token
    if (this.tokenService.isTokenExpired(localStorage.getItem('token'))) {
      // If token is expired, it deleted token with data and navigates user to login route
      this.tokenService.deleteTokenWithData();
      this.router.navigate(['/login']);
      return false;
    } else {
      // Returns true if token is valid and user can go to protected route (like add-tempalte,...)
      return true;
    }
  }
}
