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
    alert('Test');
  }

  deleteUser(): void {
    this.userService.deleteUser().subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.toast.success(res.msg);
          localStorage.clear();
          this.router.navigate(['register']);
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

}
