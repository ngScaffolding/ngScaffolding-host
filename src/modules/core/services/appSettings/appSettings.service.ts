import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { AppSettings } from '../../models/appSettings.model';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AppSettingsService extends AppSettings {
  private className = 'AppSettingsService';

  public settingsSubject = new BehaviorSubject<AppSettings>(null);

  constructor(private logger: LoggingService) {
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

  public loadFromJSON(settingsJson: string): void {
    console.log('Got Values:' + settingsJson);
    let settings = JSON.parse(settingsJson);

    if (settings) {
      // this.appSettings = settings;
    }
  }
}
