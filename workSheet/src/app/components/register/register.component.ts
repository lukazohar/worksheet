import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  username: FormControl;
  email: FormControl;
  password: FormControl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  // Creates controls with validators
  createFormControls(): void {
    this.firstName = new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('[a-zA-Ž ]*')
    ]);
    this.lastName = new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('[a-zA-Ž ]*')
    ]);
    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('[[a-z0-9_-]*')
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    ]);
  }
  // Creates group with previously made controls
  createFormGroup(): void {
    this.registerForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

  addNewUser() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe(
        data => {
          if (data.success === true) {
            this.registerForm.reset();
            this.toast.success('User created');
            this.router.navigate(['login']);
          } else {
            this.toast.warning(data.msg);
          }
        },
        err => {
          this.toast.error('Error registering');
          console.log(err);
        }
      );
    } else {
      this.toast.warning('Invalid form');
    }
  }
}
