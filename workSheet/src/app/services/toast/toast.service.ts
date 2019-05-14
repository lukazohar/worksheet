import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  // Creates 3 second long toast
  default(text: any, duration = 3000): void {
    toast(text, duration, 'rounded');
  }

  // Creates 3 second long green toast
  success(text: any, duration = 3000): void {
    toast(text, duration, 'rounded green lighten-1');
  }

  // Creates 3 second yellow toast
  warning(text: any, duration = 3000): void {
    toast(text, duration, 'rounded yellow lighten-2 black-text');
  }

  // Creates 3 second long red toast
  error(text: any, duration = 3000): void {
    toast(text, duration, 'rounded red lighten-2 white-text');
  }
}
