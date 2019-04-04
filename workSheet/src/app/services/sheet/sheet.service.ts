import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ISheet } from 'src/app/models/sheet/sheet';
import { Observable } from 'rxjs';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { IInputFields } from 'src/app/models/template/templateItems/inputFields/input-fields';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  private URL = 'http://localhost:3000/users/sheet';

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  //
  //  CRUD operations
  //
  getSheet(id: number) {
    return this.http.get('${this.rootURL}sheet?id=${id}', {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  getSheets() {
    return this.http.get(this.URL);
  }

  addSheet(sheet: ISheet): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(this.URL, sheet, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  editSheet() {

  }

  deleteSheet() {

  }


  //
  // Functions for setup of sheet
  //
  addHeader(items: FormArray, value: string): FormArray {
    console.log(value);
    items.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl(value)
    }));
    return items;
  }

  addInputFields(items: FormArray, inputField: IInputFields, index: number): FormArray {
    // @ts-ignore
    items.push(new FormGroup({
      type: new FormControl('inputFields'),
      header: new FormControl({value: inputField.header, disabled: true}),
      inputs: new FormArray([])
    }));
    for (let i = 0; i < inputField.inputs.length; i++) {
      // @ts-ignore
      items.controls[index].controls.inputs.push(new FormGroup({
        header: new FormControl(inputField.inputs[i].header),
        value: new FormControl()
      }));
    }
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
