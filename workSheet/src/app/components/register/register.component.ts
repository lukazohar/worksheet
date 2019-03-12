import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { toast } from 'angular2-materialize';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      username: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      email: new FormControl('', [Validators.required, Validators.email ]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl('', [ Validators.required, Validators.min(8) ])
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
