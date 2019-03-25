import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormsModule, Validators } from '@angular/forms';
import { TemplateService } from 'src/app/services/template/template.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  private templateForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    items: new FormArray([])
  });

  get items(): FormArray { return this.templateForm.get('items') as FormArray; }
  set items(test: FormArray) { this.templateForm.setControl('items', test); }
  // Vrniti mora formarray inputs
  // get inputs(): FormArray { return this.templateForm.get('header') as FormArray; }
  inputs(index: number): FormArray {
    return this.templateForm.controls.items[index];
  }

  constructor(
    private templateService: TemplateService,
    private toast: ToastService
  ) { }

  ngOnInit() {
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

  addTemplate(): void {
    if (this.templateForm.valid) {
      this.templateService.addTemplate(this.templateForm.value).subscribe(
        (res) => {
          if (res.success === true) {
            this.toast.success(res.msg);
          } else {
            this.toast.error(res.msg);
          }
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.toast.error('You cannot add empty template');
    }
  }
}
