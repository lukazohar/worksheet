import { ISheetItem } from './sheet-item';

export interface ISheet {
    sheet_name: string;
    sheet_description: string;
    sheet_created: string;
    sheet_modified: string;
    status: string;
    status_changed: string;
    sheet_content: Array<ISheetItem>;
}
