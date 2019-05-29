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

  loading = false;

  // Current sort type
  sort = {
    type: 'date',
    order: 'ascending',
    page: 1,
    limit: 16,
    query: ''
  };
  pageCounter = () => {
    const newArr = [];
    if (this.sort.page > 5) {
      for (let i = this.sort.page - 4; i <= this.sort.page + 4; i++) {
        newArr.push(i);
      }
    } else {
      for (let i = 1; i <= 10; i++) {
        newArr.push(i);
      }
    }
    return newArr;
  }

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  sortSheets(type: string, order: string, page?: number, limit?: number): boolean {
    this.loading = true;
    let hasBeenUpdated = false;
    this.sheetService.getSheets(type, order, this.sort.limit, this.sort.page).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // @ts-ignore
          this.sheets = res.data;
          this.sort.type = type;
          this.sort.order = order;
          this.sort.page = page;
          this.sort.limit = limit;
          hasBeenUpdated = true;
        } else {
          this.toast.error(res.msg);
        }
      },
      err => {
        console.error(err);
      }
    );
    this.loading = false;
    return hasBeenUpdated;
  }

  queryShets(): void {

  }

  changeType(newType: string): void {
    if (this.sortSheets(newType, 'ascending', this.sort.page, this.sort.limit)) {
      this.sort.type = newType;
    }
  }
  changeOrder(newOrder: string): void {
    if (this.sortSheets(this.sort.type, newOrder, this.sort.page, this.sort.limit)) {
      this.sort.order = newOrder;
    }
  }
  changePage(newPage: number): void {
    if (this.sortSheets(this.sort.type, this.sort.order, newPage, this.sort.limit)) {
      this.sort.page = newPage;
    }
  }
  changeLimit(newLimit: number): void {
    if (this.sortSheets(this.sort.type, this.sort.order, this.sort.page, newLimit)) {
      this.sort.limit = newLimit;
    }
  }
}
