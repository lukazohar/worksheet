import { IInput } from './input';

export interface IInputFields {
    type: string;
    header?: string;
    inputs?: Array<IInput>;
}
