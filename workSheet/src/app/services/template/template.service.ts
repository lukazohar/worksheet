import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ITemplate } from 'src/app/models/template/template';
import { TokenService } from '../token/token.service';
import { IInputFields } from 'src/app/models/template/templateItems/inputFields/input-fields';

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
    return this.http.post<ISuccessMsgResponse>(`${this.ULR}template`, template, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  updateTemplate(updatedTemplate: ITemplate): Observable<ISuccessMsgResponse> {
    return this.http.put<ISuccessMsgResponse>(`${this.ULR}template`, updatedTemplate, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  deleteTemplate(templateId: string): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>(`${this.ULR}template?templateId=${templateId}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  //
  // Functions adding values to existing templates
  //
  removeItem(items: FormArray, itemIndex: number): FormArray {
    items.removeAt(itemIndex);
    return items;
  }

  addHeader(items: FormArray, value?: string): FormArray {
    items.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl(value)
    }));
    return items;
  }

  addInputFields(items: FormArray, inputFields?: IInputFields, index?: number): FormArray {
    if (inputFields !== undefined) {
      items.push(new FormGroup({
        type: new FormControl('inputFields'),
        header: new FormControl(inputFields.header),
        inputs: new FormArray([])
      }));
      for (let i = 0; i < inputFields.inputs.length; i++) {
        // @ts-ignore
        items.controls[index].controls.inputs.push(new FormGroup({
          header: new FormControl(inputFields.inputs[i].header),
          value: new FormControl({ value: '', disabled: true })
        }));
      }
    } else {
      items.push(new FormGroup({
        type: new FormControl('inputFields'),
        header: new FormControl(),
        inputs: new FormArray([
          new FormGroup({
            header: new FormControl(''),
            value: new FormControl({ value: '', disabled: true })
          })
        ])
      }));
    }
    return items;
  }
  addInputField(items: FormArray, index1: number): FormArray {
    // @ts-ignore
    const inputHeader = items.controls[index1].value.header;
    // @ts-ignore
    items.controls[index1].controls.inputs.push(new FormGroup({
      header: new FormControl(''),
      value: new FormControl({ value: null, disabled: true })
    }));
    // @ts-ignore
    items.controls[index1].value.header = inputHeader;
    return items;
  }
  removeInputField(items: FormArray, itemIndex: number, fieldIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.inputs.removeAt(fieldIndex);
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
