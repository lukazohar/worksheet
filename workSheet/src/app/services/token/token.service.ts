import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private jwtHelperService: JwtHelperService
  ) { }

  getToken(): void {
    localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  deleteOnlyToken(): void {
    localStorage.removeItem('token');
  }

  deleteTokenWithData(): void {
    localStorage.clear();
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelperService.isTokenExpired(token);
  }

  extractToken(tokenString: string): string {
    return tokenString.split(' ')[1];
  }
}
