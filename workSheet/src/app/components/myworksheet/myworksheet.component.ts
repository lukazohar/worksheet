import { Component, OnInit } from '@angular/core';
import { ISheet } from 'src/app/models/sheet/sheet';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { IUserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-myworksheet',
  templateUrl: './myworksheet.component.html',
  styleUrls: ['./myworksheet.component.scss']
})
export class MyworksheetComponent implements OnInit {

  sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).userSheets;

  statusTypes: Array<string> = ['Not started yet', 'On hold', 'Finished'];

  get items(): FormArray { return this.expandedSheetForm.get('items') as FormArray; }
  set items(test: FormArray) { this.expandedSheetForm.setControl('items', test); }

  expandedSheetForm: FormGroup;
  expandedSheetFormIndex: number;

  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  sortType = 'Sort by';

  inputs(index: number): FormArray {
    return this.expandedSheetForm.controls.items[index];
  }

  constructor(
    private sheetService: SheetService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  setupSheet(): void {
    if (this.expandedSheetFormIndex > -1) {
      const sheet: ISheet = this.sheets[this.expandedSheetFormIndex];
      this.expandedSheetForm = new FormGroup({
        _id: new FormControl(),
        modified: new FormControl(),
        created: new FormControl(),
        title: new FormControl( [ Validators.required, Validators.maxLength(255) ] ),
        description: new FormControl( [ Validators.maxLength(1000) ] ),
        items: new FormArray([])
      });
      this.expandedSheetForm.reset();
      this.expandedSheetForm.controls._id.setValue(sheet._id);
      this.expandedSheetForm.controls.modified.setValue(sheet.modified);
      this.expandedSheetForm.controls.created.setValue(sheet.created);
      this.expandedSheetForm.controls.title.setValue(sheet.title);
      this.expandedSheetForm.controls.description.setValue(sheet.description);
      for (let i = 0; i < sheet.items.length; i++) {
        const type = sheet.items[i].type;
        if (type === 'header') {
          // @ts-ignore
          this.items = this.sheetService.addHeader(this.items, sheet.items[i].value);
        } else if (type === 'inputFields') {
          this.items = this.sheetService.addInputFields(this.items, sheet.items[i], i);
        }
      }
    }
  }

  expandSheet(sheetIndex: number): void {
    this.expandedSheetFormIndex = sheetIndex;
    this.setupSheet();
  }
  closeSheet(): void {
    this.expandedSheetForm = null;
    this.expandedSheetFormIndex = null;
  }

  isThisExpandedSheet(sheetIndex: number): boolean {
    return sheetIndex === this.expandedSheetFormIndex ? true : false;
  }

  updateSheet(): void {
    this.sheetService.updateSheet(this.expandedSheetForm.value).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // @ts-ignore
          this.toast.success(this.sheets[this.expandedSheetFormIndex].title + ' updated');
          this.sheets[this.expandedSheetFormIndex] = this.expandedSheetForm.value;
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          user.userSheets = this.sheets;
          localStorage.setItem('userData', JSON.stringify(user));
          this.expandedSheetFormIndex = -1;
          this.setupSheet();
        } else {
          this.toast.error(res.msg);
        }
      }
    );
  }

  deleteSheet(sheetIndex: number): void {
    this.sheetService.deleteSheet(this.sheets[sheetIndex]._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.toast.success(this.sheets[sheetIndex].title + ' deleted');
          if (sheetIndex === this.expandedSheetFormIndex) {
            this.expandedSheetFormIndex = null;
          }
          const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
          // @ts-ignore
          user.userSheets = res.data;
          localStorage.setItem('userData', JSON.stringify(user));
          // @ts-ignore
          this.sheets = res.data;
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
