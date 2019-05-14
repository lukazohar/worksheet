import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ISheet } from 'src/app/models/sheet/sheet';
import { Observable } from 'rxjs';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { IInputFields } from 'src/app/models/template/templateItems/inputFields/input-fields';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  URL = 'http://localhost:3000/sheets/sheet';

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  // Gets sheet with id in parameter from backend
  getSheet(id: number) {
    return this.http.get(this.URL + 'sheet?id=' + id, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  // Returns all sheets from backend
  getSheets() {
    return this.http.get(this.URL);
  }

  // Adds sheet to user
  addSheet(sheet: ISheet): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(this.URL, sheet, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Updates sheet with given data
  updateSheet(updatedSheet: ISheet): Observable<ISuccessMsgResponse> {
    return this.http.put<ISuccessMsgResponse>(`${this.URL}`, updatedSheet, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Delets sheet with id in parameters
  deleteSheet(sheetId: string): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>(`${this.URL}?sheetId=${sheetId}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }


  //
  // Functions for setup of sheet
  //

  // Pushes new header formGroup to array of items with value
  addHeader(items: FormArray, headerValue: string): FormArray {
    items.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl(headerValue)
    }));
    return items;
  }

  // Pushes new inputFields formGroup to array of items with values
  addInputFields(items: FormArray, inputFields: IInputFields, index: number): FormArray {
    items.push(new FormGroup({
      type: new FormControl('inputFields'),
      header: new FormControl(inputFields.header),
      inputs: new FormArray([])
    }));
    // Loops through array of inputs in group of inputs and ads form group and values
    for (let i = 0; i < inputFields.inputs.length; i++) {
      // @ts-ignore
      items.controls[index].controls.inputs.push(new FormGroup({
        header: new FormControl(inputFields.inputs[i].header),
        value: new FormControl(inputFields.inputs[i].value)
      }));
    }
    return items;
  }

  // Adds single input field with value to array of inputs
  addInputField(items: FormArray, index1: number): FormArray {
    // @ts-ignore
    const inputHeader = items.controls[index1].value.header;
    // @ts-ignore
    items.controls[index1].controls.inputs.push(new FormGroup({
      header: new FormControl(''),
      value: new FormControl('')
    }));
    // @ts-ignore
    items.controls[index1].value.header = inputHeader;
    return items;
  }

  addTable(items: FormArray): FormArray {
    // @ts-ignore
    items.push(new FormGroup({
      type: new FormControl('table'),
      header: new FormControl('')
    }));
    return items;
  }
  addTableCell(): void {
  }

  addList(items: FormArray): FormArray {
    // @ts-ignore
    items.push(new FormGroup({
      type: new FormControl('list'),
      header: new FormControl('')
    }));
    return items;
  }

  addCheckboxes(items: FormArray): FormArray {
    // @ts-ignore
    items.push(new FormGroup({
      type: new FormControl('checkboxes'),
      header: new FormControl('')
    }));
    return items;
  }
}
