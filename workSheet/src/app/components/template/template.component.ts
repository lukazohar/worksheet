import { SheetService } from 'src/app/services/sheet/sheet.service';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ITemplate } from 'src/app/models/template/template';
import * as moment from 'moment';
import { TemplateService } from 'src/app/services/template/template.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { IUserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  @Input() template: ITemplate;

  // Types of sort
  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  // Current sort
  sortType = 'Sort by';
  // Returns items from expanded form
  get items(): FormArray { return this.expandedTemplateForm.get('items') as FormArray; }
  // Sets items form array to expanded form
  set items(test: FormArray) { this.expandedTemplateForm.setControl('items', test); }

  expandedTemplateForm: FormGroup;

  // Returns inputs array from expanded form
  inputs(index: number): FormArray {
    return this.expandedTemplateForm.controls.items[index];
  }

  constructor(
    private templateService: TemplateService,
    private toast: ToastService,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
  }

  getDateFromNow(dateString: string): string {
    return moment(dateString).fromNow();
  }

  // Sets up tempalte form with data from expanded form
  setupTemplate(): void {
    this.expandedTemplateForm = new FormGroup({
      _id: new FormControl(),
      modified: new FormControl(),
      created: new FormControl(),
      title: new FormControl( [ Validators.required, Validators.maxLength(255) ] ),
      description: new FormControl( [ Validators.maxLength(1000) ] ),
      items: new FormArray([])
    });
    this.expandedTemplateForm.reset();
    // Setting values to form from selected template
    this.expandedTemplateForm.controls._id.setValue(this.template._id);
    this.expandedTemplateForm.controls.modified.setValue(this.template.modified);
    this.expandedTemplateForm.controls.created.setValue(this.template.created);
    this.expandedTemplateForm.controls.title.setValue(this.template.title);
    this.expandedTemplateForm.controls.description.setValue(this.template.description);
    // Loops through items array
    for (let i = 0; i < this.template.items.length; i++) {
      const type = this.template.items[i].type;
      if (type === 'header') {
        // If item.type is header, it adds header
        // @ts-ignore
        this.items = this.templateService.addHeader(this.items, this.template.items[i].value);
      } else if (type === 'inputFields') {
        // If type of item is input fields, it adds group of input fields
        // @ts-ignore
        this.items = this.templateService.addInputFields(this.items, this.template.items[i], i);
      }
    }
  }

  // Removes item from array of items with index
  removeItem(index: number): void {
    this.items = this.templateService.removeItem(this.items, index);
  }

  // Adds header
  addHeader(): void {
    this.items = this.templateService.addHeader(this.items);
  }

  // Adds group of input fields
  addInputFields(): void {
    this.items = this.templateService.addInputFields(this.items);
  }
  // Adds input field
  addInputField(index1: number): void {
    this.items = this.templateService.addInputField(this.items, index1);
  }
  // Removes input field
  removeInputField(index1: number, index2: number): void {
    this.items = this.templateService.removeInputField(this.items, index1, index2);
  }

  // Adds table
  addTable(): void {
    this.items = this.templateService.addTable(this.items);
  }
  // Adds table cell
  addTableCell(): void {
  }

  // Adds list
  addList(): void {
    this.items = this.templateService.addList(this.items);
  }

  // Adds checkboxes
  addCheckboxes(): void {
    this.items = this.templateService.addCheckboxes(this.items);
  }

  // Sets expanded tempalte index as selected template
  expandTemplate(): void {
    this.setupTemplate();
  }
  // Sets index and form of template to null
  closeTemplate(): void {
    this.expandedTemplateForm = null;
  }

  // Returns true if index of template in ngFor loop is equal to expanded template index
  isTemplateExpanded(): boolean {
    return this.expandedTemplateForm ? true : false;
  }

  updateTemplate(): void {
    if (this.expandedTemplateForm.valid) {
      // If template is valid, it checks if expanded template is changed by comparing stringified values of both tempaltes
      // Continues if so, otherwise it informs user about it
      if (JSON.stringify(this.expandedTemplateForm.value) !== JSON.stringify(this.template)) {
        // Calls template service for updating template
        this.templateService.updateTemplate(this.expandedTemplateForm.value).subscribe(
          (res: ISuccessMsgResponse) => {
            if (res.success) {
              // Informs user
              // @ts-ignore
              this.toast.success(this.templates[this.expandedTemplateFormIndex].title + ' updated');
              // Updates value in local storage
              this.template = this.expandedTemplateForm.value;
              const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
              localStorage.setItem('userData', JSON.stringify(user));
              this.setupTemplate();
            } else {
              this.toast.error(res.msg);
            }
          }
        );
      } else {
        // Infroms user that updating failed
        this.toast.warning(`Template isn't changed`);
      }
    } else {
      // Informs user form is not valid
      this.toast.warning('Form is not valid');
    }
  }

  deleteTemplate(templateIndex: number): void {
    // Calls template service from deleting template
    this.templateService.deleteTemplate(this.template._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // If deleting succedded, infroms user
          this.toast.success(this.template.title + ' deleted');
          // Updates array of templates in local storage
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          // @ts-ignore
          user.templates = res.data;
          localStorage.setItem('userData', JSON.stringify(user));
          // @ts-ignore
          this.templates = user.templates;
        } else {
          // Informs user that deleting failed
          this.toast.error(res.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  downloadPDF() {
  }
}
