import { IHeader } from '../template/templateItems/header/header';
import { IInputFields } from '../template/templateItems/inputFields/input-fields';

export interface ISheet {
    _id: string;
    title: string;
    description: string;
    created: string;
    modified: string;
    status: string;
    statusChanged: string;
    items: Array<IHeader | IInputFields>;
}
