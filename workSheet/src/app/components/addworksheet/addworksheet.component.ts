import { Component, OnInit } from '@angular/core';
import { ITemplate } from 'src/app/models/template/template';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addworksheet',
  templateUrl: './addworksheet.component.html',
  styleUrls: ['./addworksheet.component.scss']
})
export class AddworksheetComponent implements OnInit {

  // Extracts data of user from local storage
  templates: Array<ITemplate> = JSON.parse(localStorage.getItem('userData')).templates;
  sheetInitialized = false;
  // Maps only titles of templates from all templates, so user can select from which template he wants to created sheet
  templateTitles: Array<string> = this.templates.map((template) => {
    return template.title;
  });
  templateTitle: string;
  sheetForm: FormGroup;

  // Gets items from sheet form
  get items(): FormArray { return this.sheetForm.get('items') as FormArray; }
  // Sets items to sheet form
  set items(test: FormArray) { this.sheetForm.setControl('items', test); }

  constructor(
    private toast: ToastService,
    private sheetService: SheetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sheetForm = new FormGroup({});
  }

  // Sets up template with data from selected template
  setupSheetWithTemplate(index: number): void {
    const template: ITemplate = this.templates[index];
    this.sheetForm = new FormGroup({
      templateTitle: new FormControl(),
      title: new FormControl(),
      description: new FormControl(),
      items: new FormArray([]),
      status: new FormControl(),
      priority: new FormControl()
    });
    this.sheetForm.reset();
    this.templateTitle = template.title;
    // Sets title of tempalte selected in form
    this.sheetForm.controls.templateTitle.setValue(template.title);
    this.sheetForm.controls.status.setValue('Not Started Yet');
    this.sheetForm.controls.priority.setValue('Low');
    // Loops through all inputs in sheet
    for (let i = 0; i < template.items.length; i++) {
      const type = template.items[i].type;
      // If type of input is header, it calls addHeader
      if (type === 'header') {
        // @ts-ignore
        this.items = this.sheetService.addHeader(this.items, template.items[i].value);
      } else
      // If type of input is inputFields, it calls addInputFields
      if (type === 'inputFields') {
        // @ts-ignore
        this.items = this.sheetService.addInputFields(this.items, template.items[i], i);
      }
    }
    this.sheetInitialized = true;
  }

  addSheet(): void {
    // If sheet is valid, it calls sheet service
    if (this.sheetForm.valid) {
      this.sheetService.addSheet(this.sheetForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          // If sheet is added, it updated user data is local storage
          if (res.success === true) {
            const user = JSON.parse(localStorage.getItem('userData'));
            user.sheets.push(res.data);
            localStorage.setItem('userData', JSON.stringify(user));
            this.toast.success(res.msg);
            // Navigates to worksheets route
            this.router.navigate(['worksheets']);
          } else {
            this.toast.error(res.msg);
          }
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.toast.warning('Sheet is invalid');
    }
  }

}
