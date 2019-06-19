import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../appSettings';
import { LoggingService } from '../logging/logging.service';

import { Action, AppSettings } from '@ngscaffolding/models';
import { ActionResultModel, ActionRequestModel } from '@ngscaffolding/models';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  callAction(action: Action, inputDetails: any, rows: any[]): Observable<ActionResultModel> {

    const request: ActionRequestModel = {
      action: action, inputDetails:  JSON.stringify(inputDetails), rows: JSON.stringify(rows)
    };

    return this.http.post<ActionResultModel>(`${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/action`, request);
  }
}
