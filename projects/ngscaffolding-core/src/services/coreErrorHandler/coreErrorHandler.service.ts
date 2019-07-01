import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ErrorModel, AppSettings } from 'ngscaffolding-models';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CoreErrorHandlerService extends ErrorHandler {
  constructor(
    private appSettingsService: AppSettingsService,
    private http: HttpClient
  ) {
    super();
  }

  public logError(error, source: string = null) {}

  private processError(error, source: string = null) {}

  handleError(error, source: string = null) {
    super.handleError(error);

    if (this.appSettingsService.getValue(AppSettings.errorLogConsole)) {
      console.error(error.message);
    }
    if (this.appSettingsService.getValue(AppSettings.errorLogServer)) {
      const errorModel = new ErrorModel(error);

      if (source) {
        errorModel.source = source;
      }

      if (error.stack) {
        errorModel.stackTrace = error.stack;
      }

      // Consume any errors here. Otherwise we will just get stuck
      try {
        // This post is a fire and forget. Don't have to authorise either
        this.http.post(this.appSettingsService.getValue(AppSettings.apiHome) + '/api/v1/error', errorModel).subscribe(
          data => {
            // alert('ID: ' + data.id);
          },
          err => {
            console.log('Unable to send Error to Server, offline?');
          }
        );
      } catch (err) {
        console.log('Unable to send Error to Server, offline?');
      }
    }
    if (this.appSettingsService.getValue(AppSettings.errorShowUser)) {
      // TODO: Show User Error
    }
  }
}
