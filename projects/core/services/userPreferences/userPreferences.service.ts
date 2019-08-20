import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';

import { UserAuthenticationQuery } from '../userAuthentication';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import { UserPreferenceDefinition, UserPreferenceValue, AppSettings } from 'ngscaffolding-models';
import { UserPreferencesStore } from './userPreferences.store';
import { UserPreferencesQuery } from './userPreferences.query';
import { LoggingService } from '../logging/logging.service';
import { AppSettingsQuery } from '../appSettings/appSettings.query';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly className = 'UserPreferencesService';
  private readonly prefix = 'preference_';
  private readonly storageKey = 'UserPreferences';

  private apiHome: string;
  private valuesDownloaded = false;
  private definitionsDownloaded = false;
  private httpInFlight = 0;

  constructor(private http: HttpClient, private authQuery: UserAuthenticationQuery,
    private appSettingsQuery: AppSettingsQuery,
    private logger: LoggingService,
    private userPrefsStore: UserPreferencesStore,
    private userPrefsQuery: UserPreferencesQuery,
    private appSettings: AppSettingsService) {

      // Wait for settings, then load from server
    combineLatest([this.authQuery.authenticated$, this.appSettingsQuery.selectEntity(AppSettings.apiHome)]).subscribe(([authenticated, apiHome]) => {
      if (authenticated && apiHome && !this.valuesDownloaded && !this.definitionsDownloaded) {
        this.apiHome = apiHome.value;
        if (!this.httpInFlight) {

          // Load User Prefs from Localstorage
          this.loadFromLocal();

          // Load Pref Defs from server
          this.getDefinitions();

          // Load User Prefs from Server
          this.getValues();
          }
        } else if (!authenticated) {
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

  public deleteValue(name: string) {
    return new Observable<any>(observer => {
      this.http.delete(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/userpreferencevalue?name=${name}`).subscribe(
        () => {
          // Remove and tell the world
          this.userPrefsStore.remove(name);

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
    this.httpInFlight++;
    this.http.get<Array<UserPreferenceValue>>(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/userpreferencevalue`).subscribe(prefValues => {
      if (prefValues) {
        prefValues.forEach(prefValue => {
          this.userPrefsStore.createOrReplace(prefValue.name, prefValue);
        });
        this.userPrefsStore.setLoading(false);
        this.httpInFlight--;
        this.valuesDownloaded = true;
      }
    }, err => {
        this.httpInFlight--;
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
    this.httpInFlight++;
    this.http.get<Array<UserPreferenceDefinition>>(`${this.appSettings.getValue(AppSettings.apiHome)}/api/v1/UserPreferenceDefinition`).subscribe(prefDefinitions => {
      if (prefDefinitions && prefDefinitions.length > 0) {
        let defns = [];
        prefDefinitions.forEach(definition => {
          defns.push(definition);
        });
        this.httpInFlight--;
        this.definitionsDownloaded = true;
        this.userPrefsStore.updateRoot({ preferenceDefinitions:  defns });
      }
    },err=>{
      this.httpInFlight--;
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
