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

  inputs(index: number): FormArray {
    return this.expandedTemplateForm.controls.items[index];
  }

  constructor(
    private templateService: TemplateService,
    private toast: ToastService,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
    this.expandedTemplateForm = new FormGroup({});
  }

  setupTemplate(): void {
    if (this.expandedTemplateFormIndex > -1) {
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
          this.items = this.templateService.addHeader(this.items, template.items[i].value);
        } else if (type === 'inputFields') {
          // @ts-ignore
          this.items = this.templateService.addInputFields(this.items, template.items[i], i);
        }
      }
    }
  }

  removeItem(index: number): void {
    this.items = this.templateService.removeItem(this.items, index);
  }

  addHeader(): void {
    this.items = this.templateService.addHeader(this.items);
  }

  addInputFields(): void {
    this.items = this.templateService.addInputFields(this.items);
  }
  addInputField(index1: number): void {
    this.items = this.templateService.addInputField(this.items, index1);
  }
  removeInputField(index1: number, index2: number): void {
    this.items = this.templateService.removeInputField(this.items, index1, index2);
  }

  addTable(): void {
    this.items = this.templateService.addTable(this.items);
  }
  addTableCell(): void {
  }

  addList(): void {
    this.items = this.templateService.addList(this.items);
  }

  addCheckboxes(): void {
    this.items = this.templateService.addCheckboxes(this.items);
  }

  expandTemplate(templateIndex: number): void {
    this.expandedTemplateFormIndex = templateIndex;
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
    if (JSON.stringify(this.expandedTemplateForm.value) !== JSON.stringify(this.templates[this.expandedTemplateFormIndex])) {
      this.templateService.updateTemplate(this.expandedTemplateForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            // @ts-ignore
            this.toast.success(this.templates[this.expandedTemplateFormIndex].title + ' updated');
            this.templates[this.expandedTemplateFormIndex] = this.expandedTemplateForm.value;
            const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
            user.userTemplates = this.templates;
            localStorage.setItem('userData', JSON.stringify(user));
            this.expandedTemplateFormIndex = -1;
            this.setupTemplate();
          } else {
            this.toast.error(res.msg);
          }
        }
      );
    } else {
      this.toast.warning(`Template isn't changed`);
    }
  }

  deleteTemplate(templateIndex: number): void {
    this.templateService.deleteTemplate(this.templates[templateIndex]._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.toast.success(this.templates[templateIndex].title + ' deleted');
          if (templateIndex === this.expandedTemplateFormIndex) {
            this.expandedTemplateFormIndex = null;
          }
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          // @ts-ignore
          user.userTemplates = res.data;
          localStorage.setItem('userData', JSON.stringify(user));
          // @ts-ignore
          this.templates = user.userTemplates;
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
