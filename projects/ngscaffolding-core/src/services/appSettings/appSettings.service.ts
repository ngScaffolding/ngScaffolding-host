import { Injectable } from '@angular/core';
import { AppSettings, AppSettingsValue } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { HttpClient } from '@angular/common/http';
import { AppSettingsStore } from './appSettings.store';
import { AppSettingsQuery } from './appSettings.query';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private className = 'AppSettingsService';

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
    // this.appSettingsStore.createOrReplace(name, { Id: null, name, value });
    // if (name === AppSettings.apiHome) {
    //   this.loadFromServer(value.toString());
    // }
  }

  public getValue(name: string): any {
    if (this.appSettingsQuery.hasEntity(name)) {
      return this.appSettingsQuery.getEntity(name).value;
    } else {
      return null;
    }
  }

  private loadFromServer(apiHome: string) {
    // Load values from Server
    this.http.get<Array<AppSettingsValue>>(`${apiHome}/api/v1/appSettings`).subscribe(appValues => {
      if (appValues) {
        appValues.forEach(appValue => {
          this.setValue(appValue.name, appValue.value);
        });
      }
    });
  }

  public setValues(settings: AppSettings) {
    // Load values
    if (settings) {
      Object.keys(settings).forEach(key => {
        // Setting Value Here
        this.logger.info(`Setting Value ${key} = ${settings[key]}`, this.className + '.loadSettings');
        this.setValue(key, settings[key]);
      });
    }
  }

  public loadFromJSON() {
    return this.http
      .get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.setValues(data as AppSettings);
      });
  }
}
