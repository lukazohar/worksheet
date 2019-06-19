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

  templateForm: FormGroup;

  // Status types
  statusTypes: Array<string> = ['Not started yet', 'On hold', 'Progress', 'Finished'];

  // Gets items array from expanded template form
  get items(): FormArray { return this.templateForm.get('items') as FormArray; }
  // Sets items array to expanded template form
  set items(test: FormArray) { this.templateForm.setControl('items', test); }

  // Returns inputs from items at index
  inputs(index: number): FormArray {
    return this.templateForm.controls.items[index];
  }

  constructor(
    private templateService: TemplateService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
  }

  getDateFromNowCreated(dateString: string): string {
    return moment(dateString).fromNow();
  }
  getDateFromNowModified(dateString: string): string {
    return moment(dateString).fromNow();
  }

  // Sets up tempalte form with data from expanded form
  setupTemplate(): void {
    this.templateForm = new FormGroup({
      _id: new FormControl(),
      modified: new FormControl(),
      created: new FormControl(),
      title: new FormControl( [ Validators.required, Validators.maxLength(255) ] ),
      description: new FormControl( [ Validators.maxLength(1000) ] ),
      items: new FormArray([])
    });
    this.templateForm.reset();
    // Setting values to form from selected template
    this.templateForm.controls._id.setValue(this.template._id);
    this.templateForm.controls.modified.setValue(this.template.modified);
    this.templateForm.controls.created.setValue(this.template.created);
    this.templateForm.controls.title.setValue(this.template.title);
    this.templateForm.controls.description.setValue(this.template.description);
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
    this.templateForm = null;
  }

  // Returns true if index of template in ngFor loop is equal to expanded template index
  isTemplateExpanded(): boolean {
    return this.templateForm ? true : false;
  }

  updateTemplate(): void {
    if (this.templateForm.valid) {
      // If template is valid, it checks if expanded template is changed by comparing stringified values of both tempaltes
      // Continues if so, otherwise it informs user about it
      if (JSON.stringify(this.templateForm.value) !== JSON.stringify(this.template)) {
        // Calls template service for updating template
        this.templateService.updateTemplate(this.templateForm.value).subscribe(
          (res: ISuccessMsgResponse) => {
            if (res.success) {
              // Informs user
              this.toast.success(this.template.title + ' updated');
              // Updates value in local storage
              this.template = this.templateForm.value;
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
        this.toast.warning(`Template hasn't changed`);
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
