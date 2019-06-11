import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AppSettingsStore, AppSettingsState } from './appSettings.store';
import { AppSettingsValue } from '@ngscaffolding/models';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsQuery extends QueryEntity<AppSettingsState, AppSettingsValue> {

  isInitialised$ = this.select(state => state.isInitialised);

  constructor(protected store: AppSettingsStore) {
    super(store);
  }


}
