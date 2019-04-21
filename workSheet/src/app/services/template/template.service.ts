import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ITemplate } from 'src/app/models/template/template';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  ULR = 'http://localhost:3000/templates/';
  template: FormArray;

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  getTemplate(id: number): Observable<ITemplate> {
    return this.http.get<ITemplate>('${this.ULR}template?id=${id}', {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }
  getTemplates(): Observable<ITemplate[]> {
    return this.http.get<ITemplate[]>('${this.ULR}template', {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  addTemplate(template: ITemplate): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(this.ULR + 'template', template, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  updateTemplate(): Observable<ISuccessMsgResponse> {
    return this.http.put<ISuccessMsgResponse>('${this.ULR}template', {
      header: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  deleteTemplate(id: number): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>('${this.ULR}template?id=${id}', {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  //
  // Functions adding values to existing templates
  //
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
