import { ISheetItem } from './sheet-item';

export interface ISheet {
    _id: string;
    title: string;
    description: string;
    created: string;
    modified: string;
    status: string;
    statusChanged: string;
    content: Array<ISheetItem>;
}
