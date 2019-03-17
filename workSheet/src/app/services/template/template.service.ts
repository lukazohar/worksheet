import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  rootURL = 'http://localhost:3000/users/';
  template: FormArray;

  constructor(
    private http: HttpClient
  ) { }

  addTemplate(template: FormArray): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(this.rootURL, template.value);
  }

  updateTemplate(): void {

  }

  deleteTemplate(): void {

  }

 // Functions adding values to existing templates
  addHeader(template: FormArray): FormArray {
    template.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl('')
    }));
    return template;
  }

  addInputFields(template: FormArray): FormArray {
    template.push(new FormGroup({
      type: new FormControl('inputFields'),
      header: new FormControl(''),
      inputs: new FormArray([
        new FormGroup({
          header: new FormControl(''),
          value: new FormControl('')
        })
      ])
    }));
    return template;
  }
  addInputField(template: FormArray, index1: number): FormArray {
    // @ts-ignore
    template.controls[index1].controls.inputs.push(new FormGroup({
      header: new FormControl(''),
      value: new FormControl('')
    }));
    return template;
  }

  addTable(template: FormArray): FormArray {
    template.push(new FormGroup({
      type: new FormControl('table'),
      header: new FormControl('')
    }));
    return template;
  }
  addTableCell(): void {
  }

  addList(template: FormArray): FormArray {
    template.push(new FormGroup({
      type: new FormControl('list'),
      header: new FormControl('')
    }));
    return template;
  }

  addCheckboxes(template: FormArray): FormArray {
    template.push(new FormGroup({
      type: new FormControl('checkboxes'),
      header: new FormControl('')
    }));
    return template;
  }
}
