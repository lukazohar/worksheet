import { ITemplateItem } from './template-item';

export interface ITemplate {
    template_name: string;
    template_description: string;
    template_created: string;
    template_modified: string;
    template_content: Array<ITemplateItem>;
}
