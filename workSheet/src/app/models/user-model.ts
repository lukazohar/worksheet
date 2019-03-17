import { IProfile } from './profile/profile';
import { ISheet } from './sheet/sheet';
import { ITemplate } from './template/template';

export interface IUserModel {
    userProfile: IProfile;
    userSheets: Array<ISheet>;
    userTemplates: Array<ITemplate>;
}
