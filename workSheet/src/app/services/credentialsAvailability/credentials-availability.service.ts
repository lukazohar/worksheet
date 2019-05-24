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

  URL = 'http://localhost:3000/users';

  usernameAvailabilityQuery: any;
  emailAvailabilityQuery: any;

  // Calls username availability on backend with username in parameters
  private checkForUsernameAvailable(username: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`${this.URL}/usernameAvailability?username=${username}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  // Calls email availability on backend with email in parameters
  private checkForEmailAvailable(email: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`${this.URL}/emailAvailability?email=${email}`, {
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

}

