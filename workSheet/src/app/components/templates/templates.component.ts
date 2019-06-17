import { Component, OnInit } from '@angular/core';
import { ITemplate } from 'src/app/models/template/template';
import { TemplateService } from 'src/app/services/template/template.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

    // Gets all templates from local storage
    templates: Array<ITemplate> = JSON.parse(localStorage.getItem('userData')).templates;

    loading = false;

    // Current sort type
    type = 'date';
    order = 'ascending';
    page = 1;
    limit = 4;
    query = '';
    queryTitles: Array<number>;
    noOfSheets = 10;

    lastSortType = 'order';
/*
    pageCounter = () => {
      const noOfPages: number = Math.round(this.noOfTemplates / this.limit);
      const pageArr = [];
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
      return pageArr;
    }
 */
    constructor(
      private templateService: TemplateService,
      private toast: ToastService
    ) { }

    ngOnInit() {
    }

    removeQuery() {
      this.query = '';
    }
/*
    sortTemplates(type: string, order: string, page?: number, limit?: number): boolean {
      this.loading = true;
      let hasBeenUpdated = false;
      if (this.lastSortType === 'query') {
        this.page = 1;
        this.lastSortType = 'order';
      }
      this.templateService.getTemplates(type, order, this.limit, this.page).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            // @ts-ignore
            this.sheets = res.data;
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
        this.sheetService.getQueryedShets(query, page, limit).subscribe(
          (res: ISuccessMsgResponse) => {
            if (res.success) {
              // @ts-ignore
              this.sheets = res.data.sheets;
              // @ts-ignore
              this.noOfSheets = res.data.noOfSheets;
              // @ts-ignore
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
      if (this.sortSheets(this.type, newOrder, this.page, this.limit)) {
        this.order = newOrder;
      }
    }
    changePageSortSheets(newPage: number): void {
      if (this.sortSheets(this.type, this.order, newPage, this.limit)) {
        this.page = newPage;
      }
    }
    async changePageQuerySheets(newPage: number) {
      const hasBeenUpdated = this.querySheets(this.query, newPage, this.limit);
      if (hasBeenUpdated) {
        this.page = newPage;
      }
    }
    async changeLimit(newLimit: number) {
      let hasBeenUpdated: Promise<boolean>;
      if (this.lastSortType === 'order') {
        // hasBeenUpdated = this.sortSheets(this.type, this.order, this.page, newLimit);
      } else {
        hasBeenUpdated = this.querySheets(this.query, this.page, newLimit);
      }
      if (hasBeenUpdated) { this.limit = newLimit; }
    } */
}
