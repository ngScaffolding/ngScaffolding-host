import { BaseEntity } from './baseEntity.model';

export class ReferenceValue extends BaseEntity {

    // Used to store both name and seed in State Management. Not for users.
    compositeKey?: string;

    //type: string;
    value?: string;
    cacheSeconds?: number;

    // Filled by code when retrieved for cache reasons
    whenStored?: Date;
    
    roles?: string[];
    inputDetails?: string;

    // Possible to Hard code values Here
    referenceValueItems?: ReferenceValueItem[];

// OR

    // Used to populate from dataSource
    dataSourceName?: string;
    displayProperty?: string;
    valueProperty?: string;
    itemOrderProperty?: string;
    subtitleProperty?: string;
    metaProperty?: string;
}

export class ReferenceValueItem {
    display: string;
    value: string;
    subtitle?: string;
    subtitle2?: string;
    itemOrder?: number;
    meta?: any;

    // Allow Infinite Nesting of Reference Values Here
    referenceValueItems?: ReferenceValueItem[];
}

export function createReferenceValue(params: Partial<ReferenceValue>) {
    return {
        name: '',
        value: null
    } as ReferenceValue;
  }
  
