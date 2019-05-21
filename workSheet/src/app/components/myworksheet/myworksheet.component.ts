import { Component, OnInit } from '@angular/core';
import { ISheet } from 'src/app/models/sheet/sheet';

@Component({
  selector: 'app-myworksheet',
  templateUrl: './myworksheet.component.html',
  styleUrls: ['./myworksheet.component.scss']
})
export class MyworksheetComponent implements OnInit {

  // Gets all sheets from local storage
  sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).sheets;

  // Sort types
  sortTypes: Array<string> = ['Date', 'Priority', 'Change date'];
  // Current type
  sortType = 'Sort by';

  constructor(
  ) { }

  ngOnInit() {
  }
}
