import { CredentialsAvailabilityService } from './../../services/credentialsAvailability/credentials-availability.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { IUserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData: IUserModel = JSON.parse(localStorage.getItem('userData'));
  edit = false;
  usernameAvailabilityQuery: any;
  emailAvailabilityQuery: any;

  usernameAvailable: boolean;
  emailAvailable: boolean;

  profileForm: FormGroup;

  constructor(
    private toast: ToastService,
    private router: Router,
    private userService: UserService,
    private credentialsAvailabilityService: CredentialsAvailabilityService
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.userData.userProfile.firstName),
      lastName: new FormControl(this.userData.userProfile.lastName),
      username: new FormControl(this.userData.userProfile.username),
      email: new FormControl(this.userData.userProfile.email)
    });
  }

  changeEdit(): void {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }

  // Updates use with value of profileForm
  updateUser(): void {
    if (this.usernameAvailable && this.emailAvailable) {
      this.userService.updateUser(this.profileForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            this.toast.success(res.msg);
          } else {
            this.toast.error(res.msg);
          }
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  // Deletes user, user ID comes with token
  deleteUser(): void {
    this.userService.deleteUser().subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          localStorage.clear();
          this.router.navigate(['register']);
          this.toast.success(res.msg);
        } else {
          this.toast.error(res.msg);
        }
      },
      err => {
        console.log(err);
        this.toast.error('Error deleting user');
      }
    );
  }

  // Checks for availability of username given in first parameter every second that input has been changed last time
  checkForUsernameAvailable(username: string): void {
    this.usernameAvailable = this.credentialsAvailabilityService.checkForUsernameAvailability(username);
    console.log(this.usernameAvailable);
    console.log(this.emailAvailable);
  }

  // Checks for availability of email given in first parameter every second that input has been changed last time
  checkForEmailUsername(email: string): void {
    this.emailAvailable = this.credentialsAvailabilityService.checkForEmailAvailability(email);
  }

  test() {
    console.log('Username availbale ' + this.usernameAvailable);
    console.log('Email available ' + this.emailAvailable);
  }

}
