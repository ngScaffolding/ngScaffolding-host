import { Injectable, Type } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ReferenceValue } from '@ngscaffolding/models';


export interface ReferenceValuesState extends EntityState<ReferenceValue> {
  isInitialised: boolean;
  dynamicTypes: Type<any>[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'referenceValues', idKey: 'name' })
export class ReferenceValuesStore extends EntityStore<ReferenceValuesState, ReferenceValue> {

  constructor() {
    super({ isInitialised: false, dynamicTypes: []});
    console.log('ReferenceValuesStore Constructor');
  }
}

