import { CredentialsAvailabilityService } from './../../services/credentialsAvailability/credentials-availability.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { IProfile } from 'src/app/models/profile/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Gets profile of user from local storage
  profile: IProfile = JSON.parse(localStorage.getItem('userData')).profile;
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

  // Created profile from with user data from profile
  createFormGroup(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.profile.firstName),
      lastName: new FormControl(this.profile.lastName),
      username: new FormControl(this.profile.username),
      email: new FormControl(this.profile.email)
    });
  }

  // Changes if use if being edited
  changeEdit(): void {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }

  // Updates use with value of profileForm
  updateUser(): void {
    if (this.profileForm.valid) {
      // TODO zrihtaj urejanje profile
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
    } else {
      this.toast.warning('Profile is invalid');
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
