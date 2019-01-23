import { Injectable, Type } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AppSettingsValue, AppSettings, DataSetResults } from '@ngscaffolding/models';


export interface DataSourceState extends EntityState<DataSetResults> {
  isInitialised: boolean;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dataSource', idKey: 'key' })
export class DataSourceStore extends EntityStore<DataSourceState, DataSetResults> {

  constructor() {
    super({ isInitialised: false, dynamicTypes: []});
    console.log('DataSourceStore Constructor');
  }
}

