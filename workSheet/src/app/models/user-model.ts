import { IProfile } from './profile/profile';
import { ISheet } from './sheet/sheet';
import { ITemplate } from './template/template';

export interface IUserModel {
    _id: string;
    profile: IProfile;
    sheets: Array<ISheet>;
    templates: Array<ITemplate>;
}
