import { BaseEntity } from "../coreModels";

export class Role extends BaseEntity {
    
    description: string;

    // To administer this role you need to belong to this group
    adminRole: string;
}