import { Component, OnInit } from '@angular/core';
import { ITemplate } from 'src/app/models/template/template';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addworksheet',
  templateUrl: './addworksheet.component.html',
  styleUrls: ['./addworksheet.component.scss']
})
export class AddworksheetComponent implements OnInit {

  templates: Array<ITemplate> = JSON.parse(localStorage.getItem('userData')).userTemplates;
  sheetInitialized = false;
  templateTitles: Array<string> = this.templates.map((template) => {
    return template.title;
  });
  sheetForm: FormGroup;
  templateTitle: string;

  get items(): FormArray { return this.sheetForm.get('items') as FormArray; }
  set items(test: FormArray) { this.sheetForm.setControl('items', test); }

  constructor(
    private toast: ToastService,
    private sheetService: SheetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sheetForm = new FormGroup({});
  }

  setupSheetWithTemplate(index: number): void {
    const template: ITemplate = this.templates[index];
    this.sheetForm = new FormGroup({
      templateTitle: new FormControl(),
      title: new FormControl(),
      description: new FormControl(),
      items: new FormArray([])
    });
    this.sheetForm.reset();
    this.templateTitle = template.title;
    this.sheetForm.controls.templateTitle.setValue(template.title);
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
    this.sheetInitialized = true;
  }

  addSheet(): void {
    this.sheetService.addSheet(this.sheetForm.value).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success === true) {
          const user = JSON.parse(localStorage.getItem('userData'));
          user.userSheets.push(res.data);
          localStorage.setItem('userData', JSON.stringify(user));
          this.toast.success(res.msg);
          this.router.navigate(['worksheets']);
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
