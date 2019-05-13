import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserValidator } from 'src/app/validators/user/user.validator';

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
    private toast: ToastService,
    private userValidator: UserValidator
  ) { }


  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  // Creates controls with validators
  createFormControls(): void {
    this.firstName = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern('[a-žA-Ž ]*'),
      Validators.required
    ]);
    this.lastName = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern('[a-žA-Ž ]*'),
      Validators.required
    ]);
    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('[[a-žA-Ž0-9_-]*')
    ], [
      this.userValidator.validateUsernameAvailability()
    ]
    );
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ], [
      this.userValidator.validateEmailAvailability()
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      // password-validator packet instead of pattern and stuff
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
      if (this.username.errors.usernameExists) {
        this.toast.warning('Username is taken');
      } else if (this.email.errors.emailExists) {
        this.toast.warning('Email is taken');
      } else {
        this.generateErrors();
        this.toast.warning('Invalid form');
      }
    }
  }

  generateErrors(): void {

  }

}
