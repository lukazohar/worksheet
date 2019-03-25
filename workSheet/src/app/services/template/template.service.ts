import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ITemplate } from 'src/app/models/template/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  rootURL = 'http://localhost:3000/users/';
  template: FormArray;

  constructor(
    private http: HttpClient
  ) { }

  addTemplate(template: ITemplate): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(this.rootURL + 'template', template, {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      })
    });
  }

  updateTemplate(): void {

  }

  deleteTemplate(): void {

  }

 // Functions adding values to existing templates
  addHeader(items: FormArray): FormArray {
    items.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl('')
    }));
    return items;
  }

  addInputFields(items: FormArray): FormArray {
    // @ts-ignore
    items.push(new FormGroup({
      type: new FormControl('inputFields'),
      header: new FormControl(''),
      inputs: new FormArray([
        new FormGroup({
          header: new FormControl(''),
          value: new FormControl('')
        })
      ])
    }));
    return items;
  }
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
