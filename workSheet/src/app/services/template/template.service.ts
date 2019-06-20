import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISuccessMsgResponse } from 'src/app/models/success-msg-response';
import { ITemplate } from 'src/app/models/template/template';
import { TokenService } from '../token/token.service';
import { IInputFields } from 'src/app/models/template/templateItems/inputFields/input-fields';
import { IListRow } from 'src/app/models/template/templateItems/list/list-row';
import { IList } from 'src/app/models/template/templateItems/list/list';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  URL = '/api/templates/';
  template: FormArray;

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  // Returns all templates from backend
  getTemplate(sortType?: string, order?: string, limit?: number, page?: number): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`${this.URL}/queryTemplates?type=${sortType}&order=${order}&limit=${limit}&page=${page}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Returns all templates from backend
  getTemplates(sortType?: string, order?: string, limit?: number, page?: number): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`${this.URL}/sortTemplates?type=${sortType}&order=${order}&limit=${limit}&page=${page}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  getQueryedTemplates(query: string, page?: number, limit?: number): Observable<ISuccessMsgResponse> {
    return this.http.get<ISuccessMsgResponse>(`${this.URL}/queryTemplates?query=${query}&limit=${limit}&page=${page}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Returns observable of ISuccessMsgResponse
  addTemplate(template: ITemplate): Observable<ISuccessMsgResponse> {
    return this.http.post<ISuccessMsgResponse>(`${this.URL}template`, template, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Returns observable of ISuccessMsgResponse
  updateTemplate(updatedTemplate: ITemplate): Observable<ISuccessMsgResponse> {
    return this.http.put<ISuccessMsgResponse>(`${this.URL}template`, updatedTemplate, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Returns observable of ISuccessMsgResponse
  deleteTemplate(templateId: string): Observable<ISuccessMsgResponse> {
    return this.http.delete<ISuccessMsgResponse>(`${this.URL}template?templateId=${templateId}`, {
      headers: new HttpHeaders({
        'Authorization': this.token.getToken()
      })
    });
  }

  // Removes item with index from items array and returns it
  removeItem(items: FormArray, itemIndex: number): FormArray {
    items.removeAt(itemIndex);
    return items;
  }

  // Adds header with value to array of items
  addHeader(items: FormArray, value?: string): FormArray {
    items.push(new FormGroup({
      type: new FormControl('header'),
      value: new FormControl(value)
    }));
    return items;
  }

  // Adds input fields group with values to array of items
  addInputFields(items: FormArray, inputFields?: IInputFields, index?: number): FormArray {
    // Checks if array of inputs in inputFields is empty
    if (inputFields !== undefined) {
      items.push(new FormGroup({
        type: new FormControl('inputFields'),
        header: new FormControl(inputFields.header),
        inputs: new FormArray([])
      }));
      // Loops through array of inputs and sets values of headers
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
  // Adds input field with value to array of inputs
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
  // Removes input field with index in paramter in array of input
  removeInputField(items: FormArray, itemIndex: number, fieldIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.inputs.removeAt(fieldIndex);
    return items;
  }

  // Adds table
  addTable(items: FormArray): FormArray {
    items.push(new FormGroup({
      type: new FormControl('table'),
      rows: new FormArray([new FormGroup({
        header: new FormControl(''),
        values: new FormArray([
          new FormGroup({
            value: new FormControl('Test')
          })
        ])
      })])
    }));
    return items;
  }
  addTableRow(items: FormArray, itemIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.push(
      new FormGroup({
        header: new FormControl(''),
        values: new FormArray([
          new FormGroup({
            value: new FormControl()
          })
        ])
      })
    );
    return items;
  }
  removeTableRow(items: FormArray, itemIndex: number, rowIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.removeAt(rowIndex);
    return items;
  }
  addTableColumn(items: FormArray, itemIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.forEach(row => {
      row.controls.values.push(new FormArray([]));
    });
    return items;
  }
  removeTableColumn(items: FormArray, itemIndex: number, columnIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.forEach(row => {
      row.controls.values.removeAt(columnIndex);
    });
    return items;
  }

  // Adds list to array of items
  addList(items: FormArray, list?: IList, index?: number): FormArray {
    if (list !== undefined) {
      items.push(new FormGroup({
        type: new FormControl('list'),
        header: new FormControl(list.header),
        // Adds 1 starting row
        rows: new FormArray([])
      }));
      for (let i = 0; i < list.rows.length; i++) {
        // @ts-ignore
        items.controls[index].controls.rows.push(new FormGroup({
          header: new FormControl(list.rows[i].header)
        }));
      }
    } else {
      items.push(new FormGroup({
        type: new FormControl('list'),
        header: new FormControl(),
        rows: new FormArray([
          new FormGroup({
            header: new FormControl('')
          })
        ])
      }));
    }
    return items;
  }
  addListRow(items: FormArray, itemIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.push(new FormGroup({
      header: new FormControl('')
    }));
    return items;
  }
  removeListRow(items: FormArray, itemIndex: number, rowIndex: number): FormArray {
    // @ts-ignore
    items.controls[itemIndex].controls.rows.removeAt(rowIndex);
    return items;
  }

  // Adds checkboxes
  addCheckboxes(items: FormArray): FormArray {
    items.push(new FormGroup({
      type: new FormControl('checkboxes'),
      header: new FormControl(),
      boxes: new FormArray([
        new FormGroup({
          checked: new FormControl(false),
          value: new FormControl('')
        })
      ])
    }));
    return items;
  }
  addCheckBox(items: FormArray, itemIndex: number, value: string) {
  }
}
