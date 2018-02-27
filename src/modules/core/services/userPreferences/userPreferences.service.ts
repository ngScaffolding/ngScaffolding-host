import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { UserAuthorisationService } from '../userAuthorisation/userAuthorisation.service';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import {
  UserPreferenceDefinition,
  UserPreferenceValue
} from '../../models/userPreference.model';

@Injectable()
export class UserPreferencesService {
  private readonly prefix = 'preference_';
  private readonly storageKey = 'UserPreferences';
  private apiRootValues: string;
  private apiRootDefinitions: string;

  private preferenceValues: Map<string, UserPreferenceValue>;
  private preferenceDefinitions: Map<string, UserPreferenceDefinition>;

  public preferenceDefinitionsSubject: BehaviorSubject<Map<string, UserPreferenceDefinition>>;
  public preferenceValuesSubject: BehaviorSubject<Map<string, UserPreferenceValue>>;

  constructor(
    private http: HttpClient,
    private auth: UserAuthorisationService,
    private appSettings: AppSettingsService
  ) {
      this.preferenceValues = new Map<string, UserPreferenceValue>();
      this.preferenceDefinitions = new Map<string, UserPreferenceDefinition>();

      this.preferenceDefinitionsSubject = new BehaviorSubject<Map<string, UserPreferenceDefinition>>(null);
      this.preferenceValuesSubject = new BehaviorSubject<Map<string, UserPreferenceValue>>(null);

       appSettings.settingsSubject.subscribe(settings => {
      //   this.apiRootValues = `${settings.apiHome}/userPreferencevalues`;
      //   this.apiRootDefinitions = `${settings.apiHome}/UserPreferenceDefinitions`;
      });

      auth.authenticatedSubject.subscribe(isAuthorised => {
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
      this.preferenceValues.clear();

      // Save to LocalStorage
      localStorage.removeItem(this.storageKey);

      // Tell the world about the updates
      this.preferenceValuesSubject.next(this.preferenceValues);
    }

  public getValues(): Observable<any> {

      return new Observable<any>(observer => {
        // Load values from Server
        this.http
          .get<Array<UserPreferenceValue>>(`${this.apiRootValues}`)
          .subscribe(prefValues => {
            if (prefValues) {
              prefValues.forEach(prefValue => {
                this.setValue(prefValue.name, prefValue.value);
              });
              observer.next(this.preferenceValues);
            }

            // Tell the world the value
            observer.complete();
          });
      });
  }

  public setValue(key: string, value: any) {
    let currentPref = this.preferenceValues.get(key);

    if (!currentPref) {
      currentPref = new UserPreferenceValue();
      currentPref.userId = this.auth.currentUser.userId;
      currentPref.name = key;
    }

    currentPref.value = value;

    this.http.post(this.apiRootValues, currentPref);

    this.storeValue(key, currentPref);
  }

  private getDefinitions() {
    this.preferenceDefinitions.clear();
    this.http
      .get<Array<UserPreferenceDefinition>>(`${this.apiRootDefinitions}`)
      .subscribe(prefDefinitions => {
        if (prefDefinitions && prefDefinitions.length > 0) {
          prefDefinitions.forEach(definition => {
            this.preferenceDefinitions.set(definition.name, definition);
          });
        }
        // Tell the world the value
        this.preferenceDefinitionsSubject.next(this.preferenceDefinitions);
      });
  }

  private loadFromLocal() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const map: Map<string, UserPreferenceValue> = JSON.parse(stored);
      if (map) {
        map.forEach((value, key) => {
          this.setValue(key, value);
        });
      }
    }
  }

  private storeValue(key: string, pref: UserPreferenceValue): void {
    // Save to LocalStorage
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.preferenceValues)
    );

    // Tell the world about the updates
    this.preferenceValuesSubject.next(this.preferenceValues);
  }
}
