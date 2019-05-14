import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserValidator } from 'src/app/validators/user/user.validator';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';

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
    // First name can contain small and big letters from a-Ž
    this.firstName = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern('[a-žA-Ž ]*'),
      Validators.required
    ]);
    // Same as with first name
    this.lastName = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern('[a-žA-Ž ]*'),
      Validators.required
    ]);
    // Username has to contain small and big letter and number
    // Availability of username is being checked asynchronously
    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern('[[a-žA-Ž0-9_-]*')
    ], [
      this.userValidator.validateUsernameAvailability()
    ]
    );
    // Email has to contain @ sign and atleast one dot after @
    // Availabity of email is being checked asynchronously
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ], [
      this.userValidator.validateEmailAvailability()
    ]);
    // Password has to contain one small and big letter and number
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      // password-validator packet instead of pattern and stuff
    ]);
  }
  // Creates group with previously made controls ad validators
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
      // If register form is valid, it calls auth service for registering user
      this.authService.registerUser(this.registerForm.value).subscribe(
        (data: ISuccessMsgResponse) => {
          if (data.success === true) {
            // If user is registered, it informs him and navigates to login route
            this.registerForm.reset();
            this.toast.success('User created');
            this.router.navigate(['login']);
          } else {
            // If user is not registered, it informs user
            this.toast.warning(data.msg);
          }
        },
        err => {
          this.toast.error('Error registering');
          console.log(err);
        }
      );
    } else {
      // Checks if username has error for availability
      if (this.username.errors.usernameExists) {
        this.toast.warning('Username is taken');
      } else
      // Checks if username has error for availability
      if (this.email.errors.emailExists) {
        this.toast.warning('Email is taken');
      } else {
        // If form is invalid, it informs user
        this.toast.warning('Invalid form');
      }
    }
  }

}
