import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  default(text: any, duration = 2000): void {
    toast(text, duration, 'rounded');
  }

  success(text: any, duration = 2000): void {
    toast(text, duration, 'rounded green lighten-1');
  }

  warning(text: any, duration = 2000): void {
    toast(text, duration, 'rounded yellow lighten-2 black-text');
  }

  error(text: any, duration = 2000): void {
    toast(text, duration, 'rounded red lighten-2 white-text');
  }
}
