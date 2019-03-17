import { ITableCell } from './table-cell';

export interface ITable {
    type: string;
    header: string;
    cells: Array<ITableCell>;
}
