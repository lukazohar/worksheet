import { ISheet } from '../sheet/sheet';
import { IProfile } from '../profile/profile';
import { ITemplate } from '../template/template';

export interface ILoginResponse {
    _id: string;
    success: boolean;
    token: string;
    userData: {
        userProfile: IProfile;
        userSheets: Array<ISheet>;
        userTemplates: Array<ITemplate>;
    };
}
