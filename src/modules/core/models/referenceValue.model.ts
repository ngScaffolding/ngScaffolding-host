import { BaseEntity } from './baseEntity.model';

export class ReferenceValue extends BaseEntity {
    name: string;
    groupName: string;
    type: string;
    value: string;
    connectionName: string;
    cacheSeconds: number;
    authorisation: boolean;
    inputDetails: string;

    referenceValueItems: ReferenceValueItem[];
}

export class ReferenceValueItem extends BaseEntity {
    display: string;
    value: string;
    subtitle: string;
    subtitle2: string;
    itemOrder: number;
}
