import { Component, OnInit } from '@angular/core';
import { ISheet } from 'src/app/models/sheet/sheet';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-myworksheet',
  templateUrl: './myworksheet.component.html',
  styleUrls: ['./myworksheet.component.scss']
})
export class MyworksheetComponent implements OnInit {

  sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).userSheets;
  statusTypes: Array<string> = ['Not started yet', 'On hold', 'Finished'];

  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  sortType = 'Sort by';

  expandedSheets: Array<number> = [];

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  expandSheet(sheetIndex: number): void {
    this.expandedSheets.push(sheetIndex);
  }
  closeSheet(sheetIndex: number): void {
    this.expandedSheets.splice(this.expandedSheets.indexOf(sheetIndex), 1);
  }

  isThisExpandedSheet(sheetIndex: number): boolean {
    if (this.expandedSheets.indexOf(sheetIndex) > -1) {
      return true;
    } else {
      return false;
    }
  }

  editSheet(sheetIndex: number): void {
    console.log('Edit sheet');
  }

  deleteSheet(sheetIndex: number): void {
    const _id = this.sheets[sheetIndex]._id;
    this.sheetService.deleteSheet(_id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // Saves all sheets to localStorage
          const userData = JSON.parse(localStorage.getItem('userData'));
          userData.userSheets = res.data;
          console.log(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          // Rewrites sheets array for displaying them
          // @ts-ignore
          this.sheets = res.data;
          this.toast.success(res.msg);
        } else {
          this.toast.error(res.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  test() {
    console.log(this.expandedSheets);
  }

}
