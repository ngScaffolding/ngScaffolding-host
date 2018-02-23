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
  private readonly apiRootValues: string;
  private readonly apiRootDefinitions: string;

  private preferenceValues: Map<string, UserPreferenceValue>;
  private preferenceDefinitions: Map<string, UserPreferenceDefinition>;

  public preferenceDefinitionsSubject: BehaviorSubject<
    Map<string, UserPreferenceDefinition>
  >;
  public preferenceValuesSubject: BehaviorSubject<Map<string, UserPreferenceValue>>;

  constructor(
    private http: HttpClient,
    private auth: UserAuthorisationService,
    private appSettings: AppSettingsService
  ) {

    this.preferenceValues = new Map<string, UserPreferenceValue>();
    this.preferenceDefinitions = new Map<string, UserPreferenceDefinition>();

    this.preferenceDefinitionsSubject = new BehaviorSubject<
      Map<string, UserPreferenceDefinition>
    >(null);
    this.preferenceValuesSubject = new BehaviorSubject<
      Map<string, UserPreferenceValue>
    >(null);

    this.apiRootValues = `${this.appSettings.apiHome}/userPreferencevalues`;
    this.apiRootDefinitions = `${this.appSettings.apiHome}/UserPreferenceDefinitions`;

    // Load Pref Defs from server
    this.getDefinitions();

    // Load User Prefs from Localstorage
    this.loadFromLocal();
  }

  public getValue(key: string): Observable<any> {
    // Look for an existing one
    const currentPref = this.preferenceValues.get(key);

    if (currentPref) {
      // Already got one. Send it now.
      return new Observable<any>(observer => {
        observer.next(currentPref.value);
        observer.complete();
      });
    } else {
      return new Observable<any>(observer => {
        // Load value from Server
        this.http
          .get<UserPreferenceValue>(`${this.apiRootValues}/${key}`)
          .subscribe(pref => {
            this.storeValue(key, pref);

            // Tell the world the value
            observer.next(pref.value);
            observer.complete();
          });
      });
    }
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
      .get<Array<UserPreferenceDefinition>>(`${this.apiRootValues}`)
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
      let map: Map<string, UserPreferenceValue> = JSON.parse(stored);
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
