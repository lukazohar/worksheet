import { Component, OnInit } from '@angular/core';
import { ITemplate } from 'src/app/models/template/template';
import { TemplateService } from 'src/app/services/template/template.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { IUserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  templates: Array<ITemplate> = JSON.parse(localStorage.getItem('userData')).userTemplates;

  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  sortType = 'Sort by';

  get items(): FormArray { return this.expandedTemplateForm.get('items') as FormArray; }
  set items(test: FormArray) { this.expandedTemplateForm.setControl('items', test); }

  expandedTemplateForm: FormGroup;
  expandedTemplateFormIndex: number;

  constructor(
    private templateService: TemplateService,
    private toast: ToastService,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
    this.expandedTemplateForm = new FormGroup({});
  }

  setupTemplate(): void {
    const template: ITemplate = this.templates[this.expandedTemplateFormIndex];
    this.expandedTemplateForm = new FormGroup({
      _id: new FormControl(),
      modified: new FormControl(),
      created: new FormControl(),
      title: new FormControl( [ Validators.required, Validators.maxLength(255) ] ),
      description: new FormControl( [ Validators.maxLength(1000) ] ),
      items: new FormArray([])
    });
    this.expandedTemplateForm.reset();
    this.expandedTemplateForm.controls._id.setValue(template._id);
    this.expandedTemplateForm.controls.modified.setValue(template.modified);
    this.expandedTemplateForm.controls.created.setValue(template.created);
    this.expandedTemplateForm.controls.title.setValue(template.title);
    this.expandedTemplateForm.controls.description.setValue(template.description);
    for (let i = 0; i < template.items.length; i++) {
      const type = template.items[i].type;
      if (type === 'header') {
        // @ts-ignore
        this.items = this.sheetService.addHeader(this.items, template.items[i].value);
      } else if (type === 'inputFields') {
        // @ts-ignore
        this.items = this.sheetService.addInputFields(this.items, template.items[i], i);
      }
    }
  }

  expandTemplate(templateIndex: number): void {
    this.expandedTemplateFormIndex =  templateIndex;
    this.setupTemplate();
  }
  closeTemplate(): void {
    this.expandedTemplateForm = null;
    this.expandedTemplateFormIndex = null;
  }

  isThisExpandedTemplate(templateIndex: number): boolean {
    return templateIndex === this.expandedTemplateFormIndex ? true : false;
  }

  updateTemplate(): void {
    this.templateService.updateTemplate(this.expandedTemplateForm.value).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // @ts-ignore
          this.templates[this.expandedTemplateFormIndex] = this.expandedTemplateForm.value;
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          user.userTemplates = this.templates;
          localStorage.setItem('userData', JSON.stringify(user));
          this.setupTemplate();
          this.toast.success(this.templates[this.expandedTemplateFormIndex].title + ' updated');
        } else {
          this.toast.error(res.msg);
        }
      }
    );
  }

  deleteTemplate(templateIndex: number): void {
    this.templateService.deleteTemplate(this.templates[templateIndex]._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          if (templateIndex === this.expandedTemplateFormIndex) {
            this.expandedTemplateFormIndex = null;
          }
          // @ts-ignore
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          // @ts-ignore
          user.userTemplates = res.data;
          localStorage.setItem('userData', JSON.stringify(user));
          // @ts-ignore
          this.templates = user.userTemplates;


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
