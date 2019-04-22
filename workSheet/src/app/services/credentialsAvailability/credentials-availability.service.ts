import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class CredentialsAvailabilityService {

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  usernameAvailabilityQuery: any;
  emailAvailabilityQuery: any;

  private checkForUsernameAvailable(username: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`http://localhost:3000/users/usernameAvailability?username=${username}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  private checkForEmailAvailable(email: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`http://localhost:3000/users/emailAvailability?email=${email}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  public checkForUsernameAvailability(username: string): boolean {
    let isAvailable: boolean;
    this.checkForUsernameAvailable(username).subscribe(
      // If res.success is true, username is available
      // If res.success is false, username is taken
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      },
      err => {
        console.error(err);
      }
    );
    return isAvailable;
  }
  /*
  clearUsernameAvailabilityQuery(): void {
    clearTimeout(this.usernameAvailabilityQuery);
  } */


  // Checks for email availability every second
  public checkForEmailAvailability(email: string): boolean {
    let isAvailable: boolean;
    this.checkForEmailAvailable(email).subscribe(
      // If res.success is true, email is available
      // If res.success is false, email is taken
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      },
      err => {
        console.error(err);
      }
    );
    return isAvailable;
  }
  /*
  // Clears query if there's if user changed new email in HTML
  clearEmailAvailabilityQuery(): void {
    clearTimeout(this.emailAvailabilityQuery);
  } */
}
