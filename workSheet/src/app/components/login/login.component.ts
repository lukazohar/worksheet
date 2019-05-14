import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ILoginResponse } from 'src/app/models/login/login-response';
import { ToastService } from 'src/app/services/toast/toast.service';
import { IUserModel } from 'src/app/models/user-model';

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
      // If login form is valid. it calls auth service for logging user
      this.authService.loginUser(this.loginForm.value).subscribe(
        (data: ILoginResponse) => {
          if (data.success === true) {
            // If user credentials are correct, it calls saveData
            this.saveData(data.token, data.userData, data._id);
            this.toast.success('Successfull login');
            // Navigates to workSheet route
            this.router.navigate(['/worksheets']);
          } else {
            // If user credentials are invalid, it informs user
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

  saveData(token: string, userData: IUserModel, ID: string) {
    // All saves are to local storage
    // Saves all data
    localStorage.setItem('userData', JSON.stringify(userData));
    // Saves user ID
    localStorage.setItem('userID', ID);
    // Saves token
    localStorage.setItem('token', token);
    // Saves username
    localStorage.setItem('username', userData.userProfile.username);
  }

}
