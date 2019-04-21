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

  templates: Array<ITemplate> = JSON.parse(localStorage.getItem('userData')).userTemplates;

  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  sortType = 'Sort by';

  expandedTemplate: ITemplate;
  expandedTemplates: Array<number> = [];

  constructor(
    private templateService: TemplateService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  expandTemplate(templateIndex: number): void {
    this.expandedTemplate = this.templates[templateIndex];
    this.expandedTemplates.push(templateIndex);
  }

  isThisExpandedTemplate(templateIndex: number): void {

  }

  editTemplate(templateIndex: number): void {
    console.log('Edit template');
  }

  deleteTemplate(templateIndex: number): void {
    this.templateService.deleteTemplate(templateIndex).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
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


}
