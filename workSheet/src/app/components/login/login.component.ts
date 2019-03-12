import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ILoginResponse } from 'src/app/models/login/login-response';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe(
        (data: ILoginResponse) => {
          if (data.success === true) {
            this.saveData(data.token, data.userData, data._id);
            this.toast.success('Successfull login');
            this.router.navigate(['/worksheets']);
          } else {
            this.toast.warning('Invalid credentials');
          }
       },
       err => {
         console.log(err);
         this.toast.error('Error logging in');
       }
     );
    } else {
      this.toast.warning('Invalid credentials');
    }
  }

  saveData(token: string, userData: any, _id: string) {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userID', _id);
    localStorage.setItem('token', token);
    localStorage.setItem('username', userData.userProfile.username);
  }

}
