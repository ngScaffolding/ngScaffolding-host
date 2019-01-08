import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AppSettingsValue } from '@ngscaffolding/models';

export interface AppSettingsState extends EntityState<AppSettingsValue> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'appSettings', idKey: 'name' })
export class AppSettingsStore extends EntityStore<AppSettingsState, AppSettingsValue> {

  constructor() {
    super();
    console.log('AppSettingsStore Constructor');
  }

}

