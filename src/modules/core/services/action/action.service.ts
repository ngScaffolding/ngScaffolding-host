import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { LoggingService } from '../logging/logging.service';

import { Action } from '@ngscaffolding/models';
import { ActionResultModel, ActionRequestModel } from '@ngscaffolding/models';

@Injectable()
export class ActionService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private logger: LoggingService
  ) {}

  callAction(action: Action, inputDetails: any, rows: any[]): Observable<ActionResultModel> {

    const request: ActionRequestModel = {
      action: action, inputDetails:  JSON.stringify(inputDetails), rows: JSON.stringify(rows)
    };

    return this.http.post<ActionResultModel>(`${this.appSettingsService.apiHome}/api/v1/action`, request);
  }
}
