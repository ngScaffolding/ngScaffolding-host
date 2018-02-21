import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CacheService } from '../cache/cache.service';
import { UserAuthorisationService } from '../userAuthorisation/userAuthorisation.service';
import { AppSettingsService } from '../appSettings/appSettings.service';

// Models
import { UserPreference } from '../../models/userPreference.model';


@Injectable()
export class UserPreferencesService {

    private readonly prefix = 'preference_';
    private readonly apiRoot: string;

    private preferences: Map<string, UserPreference>;

    private prefsSubject: BehaviorSubject<Map<string, UserPreference>>;


    constructor(private http: HttpClient,
        private auth: UserAuthorisationService,
        private appSettings: AppSettingsService,
        private cache: CacheService) {

        this.prefsSubject = new BehaviorSubject<Map<string, UserPreference>>(null);
        this.apiRoot = `${this.appSettings.apiHome}/userPreference`;
    }

    public getValue(key: string): Observable<any> {
        // Look for an existing one
        let currentPref = <UserPreference>this.cache.getValue(`${this.prefix}${key}`);

        if (currentPref) {
            // Already got one. Send it now.
            return new Observable<any>(observer => {
                observer.next(currentPref.value);
                observer.complete();
            });
        } else {
            return new Observable<any>(observer => {
                // Load value from Server
                this.http.get<UserPreference>(`${this.apiRoot}/${key}`)
                    .subscribe(pref => {
                        this.cache.setValue(`${this.prefix}${key}`, pref.value);

                        this.storeValue(key, pref);

                        // Tell the world the value
                        observer.next(pref.value);
                        observer.complete();
                    });
            });
        }
    }


    public setValue(key: string, value: any) {
        let currentPref = <UserPreference>this.cache.getValue(`${this.prefix}${key}`);

        if (!currentPref) {
            currentPref = new UserPreference();
            currentPref.userName = this.auth.currentUser.userId;
            currentPref.preferenceId = key;
        }

        currentPref.value = value;

        this.http.post(this.apiRoot, currentPref);

        this.storeValue(key, currentPref);
    }

    private storeValue(key: string, pref: UserPreference): void {
        // Save to Cache for later
        this.cache.setValue(`${this.prefix}${key}`, pref);

        // Tell the world about the updates
        this.prefsSubject.next(this.preferences);
    }
}
