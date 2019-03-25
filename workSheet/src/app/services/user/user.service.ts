import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  rootURL = 'http://localhost:3000/users/profile';

  constructor(
    private http: HttpClient
  ) { }

  deleteUser(): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>(this.rootURL, {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    });
  }

  updateUser() {
    alert('Test update');
  }
}
