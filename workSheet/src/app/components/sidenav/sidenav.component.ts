import { Component, OnInit, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

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
    private toast: ToastService,
    private route: Router
  ) { }

  ngOnInit() {
  }

  showSidenav() {
    this.sidenavParams = ['show'];
    this.sidenavActions.emit('sideNav');
  }

  loggedIn(): boolean {
    if (this.tokenService.isTokenExpired(localStorage.getItem('token'))) {
      return false;
    } else {
      return true;
    }
  }

  logoutUser() {
    this.authService.logoutUser();
    this.toast.warning('Logged out');
  }

}
