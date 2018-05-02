import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { UserAuthorisationService } from '../userAuthorisation/userAuthorisation.service';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import { UserPreferenceDefinition, UserPreferenceValue } from '@ngscaffolding/models';

@Injectable()
export class UserPreferencesService {
  private readonly prefix = 'preference_';
  private readonly storageKey = 'UserPreferences';

  private apiRootValues: string;
  private apiRootDefinitions: string;

  private preferenceValues = new Array<UserPreferenceValue>();
  private preferenceDefinitions = new Array<UserPreferenceDefinition>();

  public preferenceDefinitionsSubject = new BehaviorSubject<
    Array<UserPreferenceDefinition>
  >(null);
  public preferenceValuesSubject = new BehaviorSubject<
    Array<UserPreferenceValue>
  >(null);

  constructor(
    private http: HttpClient,
    private auth: UserAuthorisationService,
    private appSettings: AppSettingsService
  ) {
    appSettings.settingsSubject.subscribe(settings => {
      this.apiRootValues = `${settings.apiHome}/api/userPreferencevalues`;
      this.apiRootDefinitions = `${
        settings.apiHome
      }/api/UserPreferenceDefinitions`;
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
    this.preferenceValues = new Array<UserPreferenceValue>();

    // Save to LocalStorage
    localStorage.removeItem(this.storageKey);

    // Tell the world about the updates
    this.preferenceValuesSubject.next(this.preferenceValues);
  }

  public getValues() {
    // Load values from Server
    this.http
      .get<Array<UserPreferenceValue>>(`${this.apiRootValues}`)
      .subscribe(prefValues => {
        if (prefValues) {
          prefValues.forEach(prefValue => {
            this.newValue(prefValue.name, prefValue.value);
          });

          // Tell the world the values
          this.preferenceValuesSubject.next(this.preferenceValues);
        }
      });
  }

  public setValue(key: string, value: any) {
    this.http
      .post(`${this.apiRootValues}`, { name: key, value: value })
      .subscribe();

    // Save and tell the world
    this.newValue(key, value);
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
    this.http
      .get<Array<UserPreferenceDefinition>>(`${this.apiRootDefinitions}`)
      .subscribe(prefDefinitions => {
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
