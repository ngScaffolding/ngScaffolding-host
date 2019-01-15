import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AppSettingsValue, AppSettings } from '@ngscaffolding/models';


export interface AppSettingsState extends EntityState<AppSettingsValue> {
  isInitialised: boolean;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'appSettings', idKey: 'name' })
export class AppSettingsStore extends EntityStore<AppSettingsState, AppSettingsValue> {

  constructor() {
    super();
    console.log('AppSettingsStore Constructor');
  }
}

