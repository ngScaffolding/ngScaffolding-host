import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import { UserPreferenceDefinition, UserPreferenceValue } from '@ngscaffolding/models';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly prefix = 'preference_';
  private readonly storageKey = 'UserPreferences';

  private apiHome: string;
  private apiRootDefinitions: string;

  private preferenceValues = new Array<UserPreferenceValue>();
  private preferenceDefinitions = new Array<UserPreferenceDefinition>();

  public preferenceDefinitionsSubject = new BehaviorSubject<Array<UserPreferenceDefinition>>(null);
  public preferenceValuesSubject = new BehaviorSubject<Array<UserPreferenceValue>>(null);

  constructor(private http: HttpClient, private auth: UserAuthorisationBase, private appSettings: AppSettingsService) {
    appSettings.settingsValues$.subscribe(settings => {
      this.apiHome = `${settings.apiHome}/api/v1/userPreferencevalue`;
      this.apiRootDefinitions = `${settings.apiHome}/api/v1/UserPreferenceDefinition`;
    });

    auth.authenticated$.subscribe(isAuthorised => {
      if (isAuthorised) {
        // Load User Prefs from Localstorage
        this.loadFromLocal();

        this.getValues();
      } else {
        // Clear Here as we logoff
        this.clearValues();
      }
    });

    // Load Pref Defs from server
    this.getDefinitions();
  }

  private clearValues() {
    this.preferenceValues = new Array<UserPreferenceValue>();

    // Save to LocalStorage
    localStorage.removeItem(this.storageKey);

    // Tell the world about the updates
    this.preferenceValuesSubject.next(this.preferenceValues);
  }

  public deleteValue(key: string) {
    return new Observable<any>(observer => {
      this.http.delete(`${this.apiHome}/${key}`).subscribe(
        () => {
          // Save and tell the world
          this.preferenceValues = this.preferenceValues.filter(p => p.name !== key);

          localStorage.removeItem(this.storageKey);

          // Tell the world about the updates
          this.preferenceValuesSubject.next(this.preferenceValues);

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
    this.http.get<Array<UserPreferenceValue>>(`${this.apiHome}`).subscribe(prefValues => {
      if (prefValues) {
        prefValues.forEach(prefValue => {
          this.newValue(prefValue.name, prefValue.value);
        });

        // Tell the world the values
        this.preferenceValuesSubject.next(this.preferenceValues);
      }
    });
  }

  public setValue(key: string, value: any): Observable<any> {
    return new Observable<any>(observer => {
      this.http.post(`${this.apiHome}`, { name: key, value: value }).subscribe(
        () => {
          // Save and tell the world
          this.newValue(key, value);

          observer.next();
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  private newValue(key: string, value: any) {
    let currentPref = this.preferenceValues.find(p => p.name === key);

    if (!currentPref) {
      currentPref = new UserPreferenceValue();
      currentPref.userId = this.auth.currentUser.userId;
      currentPref.name = key;
      currentPref.value = value;

      this.preferenceValues.push(currentPref);
    } else {
      currentPref.value = value;
    }

    this.storeValue(key, currentPref);
  }

  private getDefinitions() {
    this.preferenceDefinitions = new Array<UserPreferenceDefinition>();
    this.http.get<Array<UserPreferenceDefinition>>(`${this.apiRootDefinitions}`).subscribe(prefDefinitions => {
      if (prefDefinitions && prefDefinitions.length > 0) {
        prefDefinitions.forEach(definition => {
          this.preferenceDefinitions.push(definition);
        });
      }
      // Tell the world the value
      this.preferenceDefinitionsSubject.next(this.preferenceDefinitions);
    });
  }

  private loadFromLocal() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const map: Array<UserPreferenceValue> = JSON.parse(stored);
      if (map && map.length > 0) {
        map.forEach(value => {
          this.newValue(value.name, value.value);
        });
      }
    }
  }

  private storeValue(key: string, pref: UserPreferenceValue): void {
    // Save to LocalStorage
    const serial = JSON.stringify(this.preferenceValues);

    localStorage.setItem(this.storageKey, serial);

    // Tell the world about the updates
    this.preferenceValuesSubject.next(this.preferenceValues);
  }
}
