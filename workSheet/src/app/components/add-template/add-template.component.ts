import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormsModule, Validators } from '@angular/forms';
import { TemplateService } from 'src/app/services/template/template.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ITemplate } from 'src/app/models/template/template';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  templateForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    items: new FormArray([])
  });
  addingTemplate = false;

  // Gets items array in template form
  get items(): FormArray { return this.templateForm.get('items') as FormArray; }
  // Sets items in template form
  set items(newItems: FormArray) { this.templateForm.setControl('items', newItems); }
  // Returns inputs at index in parameter
  inputs(index: number): FormArray {
    return this.templateForm.controls.items[index];
  }

  constructor(
    private templateService: TemplateService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // Removes item
  removeItem(index: number): void {
    this.items = this.templateService.removeItem(this.items, index);
  }

  // Adds header
  addHeader(): void {
    this.items = this.templateService.addHeader(this.items);
  }

  // Adds new input fields group
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
  addTableRow(itemIndex: number) {
    this.items = this.templateService.addTableRow(this.items, itemIndex);
  }
  removeTableRow(itemIndex: number, rowIndex: number) {
    this.items = this.templateService.removeTableRow(this.items, itemIndex, rowIndex);
  }
  addTableColumn(itemIndex: number) {
    this.items = this.templateService.addTableColumn(this.items, itemIndex);
  }
  removeTableColumn(itemIndex: number, columnIndex: number) {
    this.items = this.templateService.removeTableColumn(this.items, itemIndex, columnIndex);
  }
  getValuesFromTableRow(itemIndex: number, rowIndex: number) {
    // @ts-ignore
    return this.items.controls[itemIndex].get('rows').controls[rowIndex].get('values').controls;
  }

  // Adds list
  addList(): void {
    this.items = this.templateService.addList(this.items);
  }
  addListRow(itemIndex: number): void {
    this.items = this.templateService.addListRow(this.items, itemIndex);
  }
  removeListRow(itemIndex: number, rowIndex: number): void {
    this.items = this.templateService.removeListRow(this.items, itemIndex, rowIndex);
  }

  // Adds checkboxes
  addCheckboxes(): void {
    this.items = this.templateService.addCheckboxes(this.items);
  }

  // Adds new template
  addTemplate(): void {
    // If form is valid, is calls template service for adding template
    if (this.templateForm.valid) {
      this.templateService.addTemplate(this.templateForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success === true) {
            // If template is created on backend, it saves that template and saves it to local storage
            const user = JSON.parse(localStorage.getItem('userData'));
            user.templates.push(res.data);
            localStorage.setItem('userData', JSON.stringify(user));
            this.toast.success(res.msg);
            // Navigates to templates component
            this.router.navigate(['/templates']);
          } else {
            // If tempalte isn't created on backend, it informs user
            this.toast.error(res.msg);
          }
        },
        err => {
          console.error(err);
        }
      );
    } else {
      // If form is inavalid, it doesn't call service because form is not changed. It informs user
      this.toast.error('You cannot add empty template');
    }
  }
}
