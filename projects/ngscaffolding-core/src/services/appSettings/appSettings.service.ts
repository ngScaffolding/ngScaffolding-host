import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, AppSettingsValue } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';


@Injectable({
  providedIn: 'root',
})
export class AppSettingsService extends AppSettings {
  private className = 'AppSettingsService';

  public settingsValues$: Observable<AppSettings>;
  private settingsSubject = new BehaviorSubject<AppSettings>(null);

  constructor(private logger: LoggingService, private http: HttpClient) {
    super();

    this.settingsValues$ = this.settingsSubject.asObservable();
  }

  private loadFromServer() {
    // Load values from Server
    this.http.get<Array<AppSettingsValue>>(`${this.apiHome}/api/v1/appSettings`).subscribe(appValues => {

      if (appValues) {
        appValues.forEach(appValue => {
          this[appValue.name] = appValue.value;
        });

        // Tell the world the values
        this.settingsSubject.next(this);
      }
    });
  }

  public setValues(settings: AppSettings) {
    // Load values
    if (settings) {
      Object.keys(settings).forEach(key => {
        // Setting Value Here
        this.logger.info(`Setting Value ${key} = ${settings[key]}`, this.className + '.loadSettings');
        this[key] = settings[key];
      });
    }
    this.settingsSubject.next(this);

    // Load from server last as the values take precedent
    this.loadFromServer();
  }

  public loadFromJSON() {
    return this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.setValues(data as AppSettings);
      });
  }
}
