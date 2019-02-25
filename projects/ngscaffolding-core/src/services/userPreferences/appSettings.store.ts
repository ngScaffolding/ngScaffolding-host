import { Injectable, Type } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { UserPreferenceValue, UserPreferenceDefinition } from '@ngscaffolding/models';


export interface UserPreferencesState extends EntityState<UserPreferenceValue> {
  preferenceDefinitions: UserPreferenceDefinition[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'userPreferences', idKey: 'name' })
export class UserPreferencesStore extends EntityStore<UserPreferencesState, UserPreferenceValue> {

  constructor() {
    super({ isInitialised: false, dynamicTypes: []});
    console.log('UserPreferencesStore Constructor');
  }
}

