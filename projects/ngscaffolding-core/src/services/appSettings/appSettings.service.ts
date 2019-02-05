import { Injectable, Type } from '@angular/core';
import { AppSettings, AppSettingsValue } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { HttpClient } from '@angular/common/http';
import { AppSettingsStore } from './appSettings.store';
import { AppSettingsQuery } from './appSettings.query';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private className = 'AppSettingsService';

  public loading$: Observable<boolean>;

  constructor(
    private appSettingsStore: AppSettingsStore,
    private appSettingsQuery: AppSettingsQuery,
    private logger: LoggingService,
    private http: HttpClient
  ) {
    console.log('AppSettingsService Constructor');
  }

  public setValue(name: string, value: any) {
    if (this.appSettingsQuery.hasEntity(name)) {
      this.appSettingsStore.update(name, { name: name, value: value });
    } else {
      this.appSettingsStore.add({ Id: null, name: name, value: value });
    }

    if (name === AppSettings.apiHome) {
        this.loadFromServer(value.toString());
    }
  }

  public getValue(name: string): any {
    if (this.appSettingsQuery.hasEntity(name)) {
      return this.appSettingsQuery.getEntity(name).value;
    } else {
      return null;
    }
  }

  public registerDynamicTypes(newTypes: Type<any>[]) {
    this.appSettingsQuery.select(state => state.dynamicTypes)
      .pipe(take(1))
      .subscribe(dynamicTypes => {
        const newList = dynamicTypes.concat(newTypes);
        this.appSettingsStore.updateRoot({ dynamicTypes: newList });
       });
  }

  private loadFromServer(apiHome: string) {
    // Mark store as loading
    this.appSettingsStore.setLoading(true);

    // Load values from Server
    this.http.get<Array<AppSettingsValue>>(`${apiHome}/api/v1/appSettings`).subscribe(
      appValues => {
        if (appValues) {
          appValues.forEach(appValue => {
            this.setValue(appValue.name, appValue.value);
          });
        }
        this.appSettingsStore.setLoading(false);
        this.appSettingsStore.updateRoot({ isInitialised: true });
      },
      err => {
        this.appSettingsStore.setLoading(false);
      }
    );
  }

  private setValues(settings: AppSettings) {
    // Mark store as loading
    this.appSettingsStore.setLoading(true);
    this.appSettingsStore.updateRoot({ isInitialised: false });

    // Load values
    if (settings) {
      Object.keys(settings).forEach(key => {
        // Setting Value Here
        this.logger.info(`Setting Value ${key} = ${settings[key]}`, this.className + '.loadSettings');
        this.setValue(key, settings[key]);
      });
    }

    this.appSettingsStore.setLoading(false);
    this.appSettingsStore.updateRoot({ isInitialised: true });
  }

  public loadFromJSON() {
    return this.http
      .get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        // this.setValues(data as AppSettings);
      });
  }

  public getBoolean(name: string): Observable<boolean> {
    return this.appSettingsQuery.selectEntity(name, entity => entity.value);
  }

  public getString(name: string): Observable<string> {
    return this.appSettingsQuery.selectEntity(name, entity => entity.value);
  }
}
