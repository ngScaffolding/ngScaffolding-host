import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { WidgetModelBase, AppSettings } from 'ngscaffolding-models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthenticationQuery } from '../userAuthentication';
import { WidgetStore } from './widget.store';
import { WidgetQuery } from './widget.query';


@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private className = 'core.WidgetService';

  private apiHome: string;

  constructor(
    private http: HttpClient,
    private widgetStore: WidgetStore,
    private widgetQuery: WidgetQuery,
    private appSettingsQuery: AppSettingsQuery,
    private authQuery: UserAuthenticationQuery,
    private log: LoggingService,
    public rolesService: RolesService
  ) {
    // First Time load away
    this.widgetStore.setLoading(false);

    // Wait for settings, then load from server
    combineLatest(this.authQuery.authenticated$, this.appSettingsQuery.selectEntity(AppSettings.apiHome)).subscribe(([authenticated, apiHome]) => {
      if (authenticated && apiHome) {
        this.apiHome = apiHome.value;
        this.widgetQuery
          .selectLoading()
          .pipe(take(1))
          .subscribe(loading => {
            if (!loading) {
              this.downloadWidgetItems();
            }
          });
      } else if (!authenticated) {
        this.widgetStore.remove();
      }
    });
  }
  public downloadWidgetItems() {
    // Mark loading status
    this.widgetStore.setLoading(true);

    this.http
      .get<Array<WidgetModelBase>>(this.apiHome + '/api/v1/widgets')
      .pipe(
        finalize(() => {
          this.widgetStore.setLoading(false);
        })
      )
      .subscribe(widgetItems => {
        this.widgetStore.add(widgetItems);
      });
  }
}
