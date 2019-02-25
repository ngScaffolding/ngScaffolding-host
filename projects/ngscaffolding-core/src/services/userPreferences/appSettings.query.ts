import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserPreferencesStore, UserPreferencesState } from './appSettings.store';
import { UserPreferenceValue } from '@ngscaffolding/models';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesQuery extends QueryEntity<UserPreferencesState, UserPreferenceValue> {

  isInitialised$ = this.select(state => state.isInitialised);

  constructor(protected store: UserPreferencesStore) {
    super(store);
  }


}
