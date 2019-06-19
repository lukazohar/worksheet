import { IHeader } from '../template/templateItems/header/header';
import { IInputFields } from '../template/templateItems/inputFields/input-fields';

export interface ISheet {
    _id: string;
    title: string;
    description: string;
    sheetCreated: string;
    sheetModified: string;
    status: string;
    statusModified: string;
    priority: string;
    priorityModified: string;
    items: Array<IHeader | IInputFields>;
}
