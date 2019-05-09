import { IUserModel } from '../user-model';

export interface ILoginResponse {
    _id: string;
    success: boolean;
    token: string;
    userData: IUserModel;
}
