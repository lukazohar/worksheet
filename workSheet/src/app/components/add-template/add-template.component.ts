import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormsModule } from '@angular/forms';
import { TemplateService } from 'src/app/services/template/template.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  templateForm: FormArray;

  constructor(
    private templateService: TemplateService
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup(): void {
    this.templateForm = new FormArray([]);
  }

  addHeader(): void {
    this.templateForm = this.templateService.addHeader(this.templateForm);
  }

  addInputFields(): void {
    this.templateForm = this.templateService.addInputFields(this.templateForm);
  }
  addInputField(index1: number): void {
    this.templateForm = this.templateService.addInputField(this.templateForm, index1);
  }

  addTable(): void {
    this.templateForm = this.templateService.addTable(this.templateForm);
  }
  addTableCell(): void {
  }

  addList(): void {
    this.templateForm = this.templateService.addList(this.templateForm);
  }

  addCheckboxes(): void {
    this.templateForm = this.templateService.addCheckboxes(this.templateForm);
  }
}
