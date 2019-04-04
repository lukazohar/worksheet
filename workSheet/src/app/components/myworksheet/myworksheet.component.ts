import { Component, OnInit } from '@angular/core';
import { ISheet } from 'src/app/models/sheet/sheet';

@Component({
  selector: 'app-myworksheet',
  templateUrl: './myworksheet.component.html',
  styleUrls: ['./myworksheet.component.scss']
})
export class MyworksheetComponent implements OnInit {

  private sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).userSheets;
  private statusTypes: Array<string> = ['Not started yet', 'On hold', 'Finished'];

  private sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  private sortType = 'Sort by';

  constructor() { }

  ngOnInit() {
  }

}
