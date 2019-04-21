import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  originalValues = {
    username: null,
    email: null
  };

  profileForm: FormGroup;

  constructor(
    private toast: ToastService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.createFormGroup();
    this.originalValues.username = this.userData.userProfile.username;
    this.originalValues.email = this.userData.userProfile.email;
  }

  createFormGroup(): void {
    this.profileForm = new FormGroup({
      _id: new FormControl(localStorage.getItem('userData')),
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

  updateUser(): void {
    this.userService.updateUser(this.profileForm.value).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.toast.success(res.msg);
        } else {
          this.toast.error(res.msg);
          console.log('User eror updating');
        }
      },
      err => {
        console.error(err);
      }
    );
  }

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

  checkForUsernameAvailable(username: string): boolean {
    let isAvailable: boolean;
    this.userService.checkUsernameAvailable(username).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      },
      err => {
        console.error(err);
      }
    );
    console.log('username is ' + isAvailable);
    return isAvailable;
  }
  checkForEmailUsername(email: string): boolean {
    let isAvailable: boolean;
    this.userService.checkEmailAvailable(email).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      },
      err => {
        console.error(err);
      }
    );
    console.log('email is: ' + isAvailable);
    return isAvailable;
  }

}
