import { ITemplateItem } from './template-item';
import { FormArray, FormControl } from '@angular/forms';

export interface ITemplate {
    title: string;
    description: string;
    items: [];
}
