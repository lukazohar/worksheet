import { ITemplate } from './template/template';
import { ISheet } from './sheet/sheet';

export interface ISuccessMsgResponse {
    success: boolean;
    msg: string;
    data: ITemplate | ISheet;
}
