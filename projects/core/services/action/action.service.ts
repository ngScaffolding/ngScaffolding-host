import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../appSettings';
import { LoggingService } from '../logging/logging.service';

import { Action, AppSettings } from 'ngscaffolding-models';
import { ActionResultModel, ActionRequestModel } from 'ngscaffolding-models';
import { UserAuthenticationQuery } from '../userAuthentication';
import { UserAuthenticationService } from '../userAuthentication';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private http: HttpClient, private appSettingsService: AppSettingsService, private authQuery: UserAuthenticationQuery) {}

  callAction(action: Action, inputDetails: any, rows: any[], baseContext: object): Observable<ActionResultModel> {
    // Add in base Context
    if (baseContext) {
      inputDetails = { ...baseContext, ...inputDetails };
    }
    // Add in standard Values
    const currentUser = this.authQuery.getValue().userDetails;
    const now = new Date();
    inputDetails['now'] = now;
    inputDetails['zuluDate'] = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()));

    inputDetails['userId'] = currentUser.userId;

    const request: ActionRequestModel = {
      action: action,
      inputDetails: inputDetails,
      rows: rows
    };

    return this.http.post<ActionResultModel>(`${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/action`, request);
  }
}
