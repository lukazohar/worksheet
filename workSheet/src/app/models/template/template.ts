import { IHeader } from './templateItems/header/header';
import { IInputFields } from './templateItems/inputFields/input-fields';
import { IList } from './templateItems/list/list';

export interface ITemplate {
    _id: string;
    created: Date;
    modified: Date;
    title: string;
    description: string;
    items: Array < any > ;
}
