import { IListRow } from './list-row';

export interface IList {
    type: string;
    header: string;
    rows: Array< IListRow >;
}
