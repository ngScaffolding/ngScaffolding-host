import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService extends AppSettings {
  private className = 'AppSettingsService';

  public settingsSubject = new BehaviorSubject<AppSettings>(null);

  constructor(private logger: LoggingService, private http: HttpClient) {
    super();
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
  }

  public loadFromJSON() {
    return this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.setValues(data as AppSettings);
      });
  }
}
