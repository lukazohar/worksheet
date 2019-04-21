import { IHeader } from './templateItems/header/header';
import { IInputFields } from './templateItems/inputFields/input-fields';

export interface ITemplate {
    _id: string;
    created: Date;
    modified: Date;
    title: string;
    description: string;
    items: Array < IHeader | IInputFields > ;
}
