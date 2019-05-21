import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ISheet } from 'src/app/models/sheet/sheet';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { IUserModel } from 'src/app/models/user-model';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit {

  @Input() sheet: ISheet;

  expandedSheetForm: FormGroup;

  // Status types
  statusTypes: Array<string> = ['Not started yet', 'On hold', 'Progress', 'Finished'];

  // Gets items array from expanded sheet form
  get items(): FormArray { return this.expandedSheetForm.get('items') as FormArray; }
  // Sets items array to expanded sheet form
  set items(test: FormArray) { this.expandedSheetForm.setControl('items', test); }

  // Returns inputs from items at index
  inputs(index: number): FormArray {
    return this.expandedSheetForm.controls.items[index];
  }

  constructor(
    private sheetService: SheetService,
    private toast: ToastService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }

  updateSheetInLocalstorage(sheetId: string, sheet: ISheet) {
    const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
    user.sheets.some((sheetCurrent, index, sheetArr) => {
      if (sheetCurrent._id === sheetId) {
        sheetArr[index] = sheet;
        localStorage.setItem('userData', JSON.stringify(user));
        return true;
      }
    });
  }

  deleteSheetInLocalStorage(sheetId: string) {
    const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
    user.sheets.some((sheetCurrent, index, sheetArr) => {
      if (sheetCurrent._id === sheetId) {
        sheetArr.splice(index, 1);
        localStorage.setItem('userData', JSON.stringify(user));
        return true;
      }
    });
  }

  isSheetExpanded(): boolean {
    return this.expandedSheetForm ? true : false;
  }

  // Sets expandedSheetIndex to index in parameter
  expandSheet(): void {
    this.setupSheet();
  }
  // Sets form and index of sheet to null (closes sheet)
  closeSheet(): void {
    this.expandedSheetForm = null;
  }

  setupSheet(): void {
    // Creates sheet with validators
    this.expandedSheetForm = new FormGroup({
      _id: new FormControl(),
      modified: new FormControl(),
      created: new FormControl(),
      title: new FormControl( [ Validators.required, Validators.maxLength(100) ] ),
      description: new FormControl( [ Validators.maxLength(255) ] ),
      items: new FormArray([]),
      status: new FormControl(this.sheet.status)
    });
    this.expandedSheetForm.reset();
    // Sets values
    this.expandedSheetForm.controls._id.setValue(this.sheet._id);
    this.expandedSheetForm.controls.modified.setValue(this.sheet.modified);
    this.expandedSheetForm.controls.created.setValue(this.sheet.created);
    this.expandedSheetForm.controls.title.setValue(this.sheet.title);
    this.expandedSheetForm.controls.description.setValue(this.sheet.description);
    this.expandedSheetForm.controls.status.setValue(this.sheet.status);
    // Loops through items array in sheet
    for (let i = 0; i < this.sheet.items.length; i++) {
      const type = this.sheet.items[i].type;
      // If type is header, it calls addHeader
      if (type === 'header') {
        // @ts-ignore
        this.items = this.sheetService.addHeader(this.items, sheet.items[i].value);
      } else
      // If type is inputFields, it calls inputFields
      if (type === 'inputFields') {
        this.items = this.sheetService.addInputFields(this.items, this.sheet.items[i], i);
      }
    }
  }

  updateSheet(): void {
    // If sheet form is valid, it calls sheet service
    if (this.expandedSheetForm.valid) {
      this.sheetService.updateSheet(this.expandedSheetForm.value).subscribe(
        (res: ISuccessMsgResponse) => {
          if (res.success) {
            // If sheet is updated, it saves sheet to localStorage
            const user: IUserModel = JSON.parse(localStorage.getItem('userData'));
            // Loops through array of sheets from local storage
            user.sheets.some((sheet, index, sheetsArr) => {
              // If _id of sheet in loop is equal to this.sheet._id, it replaces value at
              // current index of sheets with updated sheet value and breaks loop
              if (sheet._id === this.sheet._id) {
                sheetsArr[index] = this.expandedSheetForm.value;
                return true;
              }
            });
            localStorage.setItem('userData', JSON.stringify(user));
            this.setupSheet();
            this.toast.success(this.sheet.title + ' updated');
          } else {
            this.toast.error(res.msg);
          }
        }, err => {
          console.error(err);
        }
      );
    } else {
      this.toast.warning('Sheet is invalid');
    }
  }

  deleteSheet(): void {
    // Calls sheet service with index of shet to be deleted
    this.sheetService.deleteSheet(this.sheet._id).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          // If sheet is deleted, it removes element in array of sheets at index and saves updated sheet to local storage
          this.deleteSheetInLocalStorage(this.sheet._id);
          this.elementRef.nativeElement.remove();
          this.toast.success(this.sheet._id + ' deleted');
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

  setStatus(newStatus: string): void {
    this.sheetService.setStatus(this.sheet._id, newStatus).subscribe(
      (res: ISuccessMsgResponse) => {
        // If change of status succeded on backend it sets status to updated status
        if (res.success) {
          this.sheet.status = newStatus;
          // @ts-ignore
          this.sheet.statusModified = res.data;
          // @ts-ignore
          this.sheet.modified = res.data;
          this.updateSheetInLocalstorage(this.sheet._id, this.sheet);
          this.toast.success(res.msg);
        } else {
          this.toast.error(res.msg);
        }
      }, err => {
        console.error(err);
      }
    );
  }

  setPriority(newPriority: string): void {
    this.sheetService.setPriority(this.sheet._id, newPriority).subscribe(
      (res: ISuccessMsgResponse) => {
        if (res.success) {
          this.sheet.priority = newPriority;
          // @ts-ignore
          this.sheet.priorityModified = res.data;
          // @ts-ignore
          this.sheet.modified = res.data;
          this.updateSheetInLocalstorage(this.sheet._id, this.sheet);
          this.toast.success(res.msg);
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
