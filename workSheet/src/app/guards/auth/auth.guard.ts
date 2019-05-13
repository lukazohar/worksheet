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
    if (this.tokenService.isTokenExpired(localStorage.getItem('token'))) {
      this.tokenService.deleteTokenWithData();
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
