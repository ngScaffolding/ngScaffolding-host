import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserAuthenticationQuery } from '../userAuthentication';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import { UserPreferenceDefinition, UserPreferenceValue, AppSettings } from 'ngscaffolding-models';
import { UserPreferencesStore } from './userPreferences.store';
import { UserPreferencesQuery } from './userPreferences.query';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly className = 'UserPreferencesService';
  private readonly prefix = 'preference_';
  private readonly storageKey = 'UserPreferences';

  constructor(private http: HttpClient, private authQuery: UserAuthenticationQuery,
    private logger: LoggingService,
    private userPrefsStore: UserPreferencesStore,
    private userPrefsQuery: UserPreferencesQuery,
    private appSettings: AppSettingsService) {

    authQuery.authenticated$.subscribe(isAuthorised => {
      if (isAuthorised) {
        this.userPrefsStore.setLoading(true);

        // Load User Prefs from Localstorage
        this.loadFromLocal();

        // Load Pref Defs from server
        this.getDefinitions();

        // Load User Prefs from Server
        this.getValues();
      } else {
        // Clear Here as we logoff
        this.clearValues();
      }
    });
  }

  private clearValues() {
    this.userPrefsStore.remove();

    // Save to LocalStorage
    localStorage.removeItem(this.storageKey);
  }

  public deleteValue(key: string) {
    return new Observable<any>(observer => {
      this.http.delete(`${this.appSettings.getValue(AppSettings.apiHome)}/${key}`).subscribe(
        () => {
          // Remove and tell the world
          this.userPrefsStore.remove(key);

          localStorage.removeItem(this.storageKey);
          this.saveToLocal();

          observer.next();
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  public getValues() {
    // Load values from Server
    this.http.get<Array<UserPreferenceValue>>(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/userpreferencevalue`).subscribe(prefValues => {
      if (prefValues) {
        prefValues.forEach(prefValue => {
          this.userPrefsStore.createOrReplace(prefValue.name, prefValue);
        });
        this.userPrefsStore.setLoading(false);
      }
    }, err => {
        this.logger.error(err, this.className , true);
    });
  }

  public setValue(key: string, value: any): Observable<any> {
    return new Observable<any>(observer => {
      this.http.post(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/userpreferencevalue`, { name: key, value: value }).subscribe(
        () => {
          const existingEntity = this.userPrefsQuery.getEntity(key);
          let newEntity = new UserPreferenceValue();

          if (existingEntity) {
            newEntity = JSON.parse(JSON.stringify(existingEntity));
          } else {
            newEntity.name = key;
            newEntity.userId = this.authQuery.getSnapshot().userDetails.userId;
          }

          newEntity.value = value;
          this.userPrefsStore.createOrReplace(key, newEntity);

          observer.next();
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  private getDefinitions() {
    this.http.get<Array<UserPreferenceDefinition>>(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/UserPreferenceDefinition`).subscribe(prefDefinitions => {
      if (prefDefinitions && prefDefinitions.length > 0) {
        let defns = [];
        prefDefinitions.forEach(definition => {
          defns.push(definition);
        });
        this.userPrefsStore.updateRoot({ preferenceDefinitions:  defns });
      }
    });
  }

  private loadFromLocal() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const map: Array<UserPreferenceValue> = JSON.parse(stored);
      if (map && map.length > 0) {
        map.forEach(value => {
          // this.userPrefsStore.createOrReplace(value.name, value.value);
        });
      }
    }
  }

  private saveToLocal(): void {
    // Save to LocalStorage
    const serial = JSON.stringify(this.userPrefsQuery.getSnapshot().entities);

    localStorage.setItem(this.storageKey, serial);
  }
}
