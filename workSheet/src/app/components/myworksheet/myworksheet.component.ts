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

  // Current sort type
  sortType = 'date ascending';
  page = 0;
  limit = 0;

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  sortSheets(type: string, order: string): void {
    this.sortType = type.toLowerCase() + ' ' + order;
    this.sheetService.getSheets(type.toLowerCase(), order, this.limit, this.page).subscribe(
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
