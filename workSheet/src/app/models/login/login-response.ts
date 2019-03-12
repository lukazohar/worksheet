import { ISheet } from '../sheet/sheet';
import { IProfile } from '../profile/profile';
import { ITemplateItem } from '../template/template-item';

export interface ILoginResponse {
    _id: string;
    success: boolean;
    token: string;
    userData: {
        userProfile: IProfile;
        userSheets: Array<ISheet>;
        userTemplates: Array<ITemplateItem>;
    };
}
