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
  templates: Array<ITemplate>;

  loading = false;

  // Current sort type
  type = 'date';
  order = 'descending';
  page = 1;
  limit = 4;
  query = '';
  queryTitles: Array<number>;
  noOfTemplates: number;
  lastSortType = 'order';

  pageCounter = () => {
    const noOfPages: number = Math.ceil(this.noOfTemplates / this.limit);
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
      private templateService: TemplateService,
      private toast: ToastService
    ) { }

    ngOnInit() {
      this.sortTemplates(this.type, this.order, this.page, this.limit);
    }

    removeQuery() {
      this.query = '';
      this.sortTemplates(this.type, this.order, this.page, this.limit);
      this.lastSortType = 'order';
    }

    sortTemplates(type: string, order: string, page?: number, limit?: number): boolean {
      this.loading = true;
      let hasBeenUpdated = false;
      if (this.lastSortType === 'query') {
        this.page = 1;
        this.lastSortType = 'order';
        this.query = '';
      }
      this.templateService.getTemplates(type, order, limit, page).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            this.templates = res.data[0].templates;
            this.noOfTemplates = res.data[0].noOfTemplates;
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

    async queryTemplates(query: string, page: number, limit: number) {
      this.loading = true;
      let hasBeenUpdated = false;
      if (this.lastSortType === 'order') {
        this.page = 1;
        this.lastSortType = 'query';
      }
      setTimeout(() => {
        this.loading = true;
        this.templateService.getQueryedTemplates(query, page, limit).subscribe(
          (res: ISuccessMsgResponse) => {
            if (res.success) {
              this.templates = res.data.templates;
              this.noOfTemplates = res.data.noOfTemplates;
              this.queryTitles = res.data.templatesTitles;
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
      if (this.sortTemplates(newType, 'ascending', this.page, this.limit)) {
        this.type = newType;
      }
    }
    changeOrder(newOrder: string): void {
      this.page = 1;
      if (this.sortTemplates(this.type, newOrder, this.page, this.limit)) {
        this.order = newOrder;
      }
    }
    changePage(newPage: number): void {
      if (this.lastSortType === 'order') {
        if (this.sortTemplates(this.type, this.order, newPage, this.limit)) {
          this.page = newPage;
        }
      } else {
        if (this.queryTemplates(this.query, newPage, this.limit)) {
          this.page = newPage;
        }
      }
    }
    changeLimit(newLimit: number) {
      this.page = 1;
      this.loading = true;
      if (this.lastSortType === 'order') {
        this.sortTemplates(this.type, this.order, this.page, newLimit);
      } else {
        this.queryTemplates(this.query, this.page, newLimit);
      }
      this.limit = newLimit;
      this.loading = false;
    }
}
