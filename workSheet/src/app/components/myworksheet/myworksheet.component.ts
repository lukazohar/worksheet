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

  // Gets all sheets from local storage
  sheets: Array<ISheet> = JSON.parse(localStorage.getItem('userData')).userSheets;

  // Status types
  statusTypes: Array<string> = ['Not started yet', 'On hold', 'Finished'];

  // Gets items array from expanded sheet form
  get items(): FormArray { return this.expandedSheetForm.get('items') as FormArray; }
  // Sets items array to expanded sheet form
  set items(test: FormArray) { this.expandedSheetForm.setControl('items', test); }

  expandedSheetForm: FormGroup;
  expandedSheetFormIndex: number;

  // Sort types
  sortTypes: Array<string> = ['Date of adding', 'Priority', 'Date of last change'];
  // Cureent type
  sortType = 'Sort by';

  // Returns inputs from items at index
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
    // If any sheet is selected, it setups it
    if (this.expandedSheetFormIndex > -1) {
      const sheet: ISheet = this.sheets[this.expandedSheetFormIndex];
      // Creates sheet with validators
      this.expandedSheetForm = new FormGroup({
        _id: new FormControl(),
        modified: new FormControl(),
        created: new FormControl(),
        title: new FormControl( [ Validators.required, Validators.maxLength(255) ] ),
        description: new FormControl( [ Validators.maxLength(1000) ] ),
        items: new FormArray([])
      });
      this.expandedSheetForm.reset();
      // Sets values
      this.expandedSheetForm.controls._id.setValue(sheet._id);
      this.expandedSheetForm.controls.modified.setValue(sheet.modified);
      this.expandedSheetForm.controls.created.setValue(sheet.created);
      this.expandedSheetForm.controls.title.setValue(sheet.title);
      this.expandedSheetForm.controls.description.setValue(sheet.description);
      // Loops through items array in sheet
      for (let i = 0; i < sheet.items.length; i++) {
        const type = sheet.items[i].type;
        // If type is header, it calls addHeader
        if (type === 'header') {
          // @ts-ignore
          this.items = this.sheetService.addHeader(this.items, sheet.items[i].value);
        } else
        // If type is inputFields, it calls inputFields
        if (type === 'inputFields') {
          this.items = this.sheetService.addInputFields(this.items, sheet.items[i], i);
        }
      }
    }
  }

  // Sets expandedSheetIndex to index in parameter
  expandSheet(sheetIndex: number): void {
    this.expandedSheetFormIndex = sheetIndex;
    this.setupSheet();
  }
  // Sets form and index of sheet to null (closes sheet)
  closeSheet(): void {
    this.expandedSheetForm = null;
    this.expandedSheetFormIndex = null;
  }

  // Returns if sheet with index in parameter is expanded
  isThisExpandedSheet(sheetIndex: number): boolean {
    return sheetIndex === this.expandedSheetFormIndex ? true : false;
  }

  updateSheet(): void {
    if (this.expandedSheetForm.valid) {
      // If sheet form is valid, it calls sheet service
      this.sheetService.updateSheet(this.expandedSheetForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            // If sheet is updated, it saves sheet to localStorage
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
    } else {
      this.toast.warning('Sheet is invalid');
    }
  }

  deleteSheet(sheetIndex: number): void {
    // Calls sheet service with index of shet to be deleted
    this.sheetService.deleteSheet(this.sheets[sheetIndex]._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // If sheet is deleted, it removes element in array of sheets at index and saves updated sheet to local storage
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
          // If sheet is not deleted, it informs user
          this.toast.error(res.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
