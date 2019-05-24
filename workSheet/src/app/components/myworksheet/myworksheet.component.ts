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

  // Gets all sheets from local storage
  sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).sheets;

  // Sort types
  sortTypes: Array<string> = ['Date', 'Priority', 'Change date'];
  // Current type
  sortType = 'Sort by';

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  sortSheets(sortType: string): void {
    this.sheetService.getSheets(sortType).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // @ts-ignore
          this.sheets = res.data;
          console.log(res.data);
        } else {
          this.toast.error(res.msg);
        }
      },
      err => {
        console.error(err);
      }
    );
  }
}
