import { Component, OnInit, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  routeNamesLoggedIn = [
    'worksheets',
    'profile',
    'add-worksheet'
  ];

  routeNamesNotLoggedIn = [
    'login',
    'register'
  ];

  sidenavActions = new EventEmitter<any>();
  sidenavParams = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  showSidenav() {
    this.sidenavParams = ['show'];
    this.sidenavActions.emit('sideNav');
  }

  // Checks if user if logged in
  loggedIn(): boolean {
    if (this.tokenService.isTokenExpired(localStorage.getItem('token'))) {
      return false;
    } else {
      return true;
    }
  }

  // Calls auth service to logout user
  logoutUser() {
    this.authService.logoutUser();
    this.toast.warning('Logged out');
  }
}
