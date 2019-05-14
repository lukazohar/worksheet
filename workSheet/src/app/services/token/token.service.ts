import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private jwtHelperService: JwtHelperService
  ) { }

  // Returns token value from local storage
  getToken(): string {
    return localStorage.getItem('token');
  }

  // Sets token from parameters to local storage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Delets only token in local storage
  deleteOnlyToken(): void {
    localStorage.removeItem('token');
  }

  // Clears whole local storage
  deleteTokenWithData(): void {
    localStorage.clear();
  }

  // Checks token expiration with jwt service
  isTokenExpired(token: string): boolean {
    return this.jwtHelperService.isTokenExpired(token);
  }

  // Extracts token from token string (JWT token_value), returns only token_value
  extractToken(tokenString: string): string {
    return tokenString.split(' ')[1];
  }
}
