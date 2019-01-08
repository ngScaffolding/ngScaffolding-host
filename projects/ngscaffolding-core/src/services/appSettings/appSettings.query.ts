import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AppSettingsStore, AppSettingsState } from './appSettings.store';
import { AppSettingsValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsQuery extends QueryEntity<AppSettingsState, AppSettingsValue> {

  constructor(protected store: AppSettingsStore) {
    super(store);
  }

  public getBoolean(name: string): Observable<boolean> {
    return this.selectEntity(name, entity => entity.value);
  }

  public getString(name: string): Observable<string> {
    return this.selectEntity(name, entity => entity.value);
  }
}
