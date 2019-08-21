import { Injectable, Type } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AppSettingsValue, AppSettings } from 'ngscaffolding-models';


export interface AppSettingsState extends EntityState<AppSettingsValue> {
  isInitialised: boolean;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'appSettings', idKey: 'name' })
export class AppSettingsStore extends EntityStore<AppSettingsState, AppSettingsValue> {

  constructor() {
    super({ isInitialised: false });
    console.log('AppSettingsStore Constructor');
  }
}

