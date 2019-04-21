import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { IProfile } from 'src/app/models/profile/profile';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL = 'http://localhost:3000/users/profile';

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  deleteUser(): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>(this.URL, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  updateUser(updatedProfile: IProfile): Observable<ISuccessMsgResponse> {
    return this.http.put<ISuccessMsgResponse>(this.URL + 'sad', updatedProfile, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  checkUsernameAvailable(username: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>('http://localhost:3000/users/username?username=' + username, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  checkEmailAvailable(email: string): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>('http://localhost:3000/users/email?email=' + email, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
}
