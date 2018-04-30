import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { LoggingService } from '../logging/logging.service';

import { ActionModel } from '../../models/index';
import { ActionResultModel, ActionRequestModel } from './actionRequest.model';

@Injectable()
export class ActionService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private logger: LoggingService
  ) {}

  callAction(action: ActionModel, inputDetails: any, rows: any[]): Observable<ActionResultModel> {

    const request: ActionRequestModel = {
      action: action, inputDetails:  JSON.stringify(inputDetails), rows: JSON.stringify(rows)
    };

    return this.http.post<ActionResultModel>(`${this.appSettingsService.apiHome}/api/action`, request);
  }
}
