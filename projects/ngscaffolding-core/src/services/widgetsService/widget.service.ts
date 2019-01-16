import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { WidgetModelBase, AppSettings } from '@ngscaffolding/models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { WidgetStore } from './widget.store';
import { WidgetQuery } from './widget.query';
import { isArray } from 'util';
import { finalize } from 'rxjs/internal/operators/finalize';
import { take } from 'rxjs/internal/operators/take';

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
    private authService: UserAuthorisationBase,
    private log: LoggingService,
    public rolesService: RolesService
  ) {
    // First Time load away
    this.widgetStore.setLoading(false);

    // Wait for settings, then load from server
    combineLatest(this.authService.authenticated$, this.appSettingsQuery.selectEntity(AppSettings.apiHome)).subscribe(([authenticated, apiHome]) => {
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
