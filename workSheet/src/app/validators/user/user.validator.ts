import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, map, switchMap } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token/token.service';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserValidator {

  URL = 'http://localhost:3000/api/users/';

  constructor(
    private http: HttpClient
  ) { }

  // Request for username availability with 1 second delay
  private isUsernameAvailable(username: string) {
    return timer(1000).
      pipe(
        switchMap(() => {
          return this.http.get<any>(`${this.URL}usernameAvailability?username=${username}`);
        }
      ));
  }
  // Returns object if username is unavailable, or null if it's available
  validateUsernameAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null > => {
      return this.isUsernameAvailable(control.value)
        .pipe(
          map(res => {
            if (res) {
              return null;
            } else {
              return { 'usernameExists': true };
            }
          })
        );
    };
  }

  // Request for email availability with 1 second delay
  private isEmailAvailable(email: string) {
    return timer(1000).
      pipe(
        switchMap(() => {
          return this.http.get<any>(`${this.URL}emailAvailability?email=${email}`);
        }
      ));
  }
  // Returns object with message if email is unavailable, null if it's available
  validateEmailAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null > => {
      return this.isEmailAvailable(control.value)
        .pipe(
          map(res => {
            // Returns null (is valid) if is email is available
            if (res) {
              return null;
            } else {
            // Returns object with message if email is taken
              return { 'emailExists': true };
            }
          })
        );
    };
  }
}
