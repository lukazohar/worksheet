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
  sheets: Array<ISheet>;

  loading = false;

  // Current sort type
  type = 'date';
  order = 'descending';
  page = 1;
  limit = 4;
  query = '';
  queryTitles: Array<number>;
  noOfSheets: number;

  lastSortType = 'order';

  pageCounter = () => {
    const noOfPages: number = Math.ceil(this.noOfSheets / this.limit);
    const pageArr = [];
    if (this.limit === 0) {
      pageArr.push(1);
    } else {
      if (this.page > 4) {
        if (this.page + 4 <= noOfPages) {
          for (let i = this.page - 4; i < this.page + 5; i++) {
            pageArr.push(i);
          }
        } else {
          for (let i = noOfPages - 8; i <= noOfPages; i++) {
            pageArr.push(i);
          }
        }
      } else {
        if (noOfPages > 9) {
          for (let i = 1; i <= 9; i++) {
            pageArr.push(i);
          }
        } else {
          for (let i = 1; i <= noOfPages; i++) {
            pageArr.push(i);
          }
        }
      }
    }
    return pageArr;
  }

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.sortSheets(this.type, this.order, this.page, this.limit);
  }

  removeQuery() {
    this.query = '';
    this.sortSheets(this.type, this.order, this.page, this.limit);
    this.lastSortType = 'order';
  }

  sortSheets(type: string, order: string, page?: number, limit?: number): boolean {
    this.loading = true;
    let hasBeenUpdated = false;
    if (this.lastSortType === 'query') {
      this.page = 1;
      this.lastSortType = 'order';
      this.query = '';
    }
    this.sheetService.getSheets(type, order, limit, page).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.sheets = res.data[0].sheets;
          this.noOfSheets = res.data[0].noOfSheets;
          this.type = type;
          this.order = order;
          this.page = page;
          this.limit = limit;
          this.query = '';
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

  async querySheets(query: string, page: number, limit: number) {
    this.loading = true;
    let hasBeenUpdated = false;
    if (this.lastSortType === 'order') {
      this.page = 1;
      this.lastSortType = 'query';
    }
    setTimeout(() => {
      this.loading = true;
      this.sheetService.getQueryedSheets(query, page, limit).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            this.sheets = res.data.sheets;
            this.noOfSheets = res.data.noOfSheets;
            this.queryTitles = res.data.sheetsTitles;
            this.query = query;
            hasBeenUpdated = true;
          }
        }, err => {
          console.error(err);
        }
      );
      this.loading = false;
    }, 1000);
    return hasBeenUpdated;
  }

  changeType(newType: string): void {
    this.page = 1;
    if (this.sortSheets(newType, 'ascending', this.page, this.limit)) {
      this.type = newType;
    }
  }
  changeOrder(newOrder: string): void {
    this.page = 1;
    if (this.sortSheets(this.type, newOrder, this.page, this.limit)) {
      this.order = newOrder;
    }
  }
  changePage(newPage: number): void {
    if (this.lastSortType === 'order') {
      if (this.sortSheets(this.type, this.order, newPage, this.limit)) {
        this.page = newPage;
      }
    } else {
      if (this.querySheets(this.query, newPage, this.limit)) {
        this.page = newPage;
      }
    }
  }
  changeLimit(newLimit: number) {
    this.page = 1;
    this.loading = true;
    if (this.lastSortType === 'order') {
      this.sortSheets(this.type, this.order, this.page, newLimit);
    } else {
      this.querySheets(this.query, this.page, newLimit);
    }
    this.limit = newLimit;
    this.loading = false;
  }
}
