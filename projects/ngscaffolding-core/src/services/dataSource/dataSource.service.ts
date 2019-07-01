import { Observable, forkJoin, throwError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { DataSourceRequest, DataResults, AppSettings } from 'ngscaffolding-models';
import { LoggingService } from '../logging/logging.service';
import { DataSourceStore } from './dataSource.store';
import { DataSourceQuery } from './dataSource.query';
import {} from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private className = 'DataSourceService';

  constructor(
    private http: HttpClient,
    private dataSourceStore: DataSourceStore,
    private dataSourceQuery: DataSourceQuery,
    private appSettingsService: AppSettingsService,
    private logger: LoggingService
  ) {}

  getDataSource(dataRequest: DataSourceRequest): Observable<DataResults> {
    const key = this.getKey(dataRequest);

    const currentRequest = this.dataSourceQuery.getEntity(key);

    if (dataRequest.forceRefresh || currentRequest === undefined || currentRequest.expiresWhen < new Date()) {
      const now = new Date();
      const placeHolderResults: DataResults = {
        inflight: true,
        expiresWhen: new Date(now.getTime() + 300 * 10000)
      };

      // Save as marker that the request has been sent
      this.dataSourceStore.createOrReplace(key, placeHolderResults);

      this.http
        .post<DataResults>(`${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/datasource`, dataRequest)
        .pipe(timeout(30000))
        .subscribe(
          values => {
            const expiryNow = new Date();

            // If expires Seconds not provided set long expiry
            const expiresSeconds = values.expiresSeconds > 0 ? values.expiresSeconds : 99999999;
            const expiresWhen = new Date(expiryNow.getTime() + expiresSeconds * 10000);
            const newResults: DataResults = {
              inflight: false,
              expiresWhen: expiresWhen,
              rowCount: values.rowCount,
              jsonData: values.jsonData,
              results: values.results
            };

            // Update the Store to tell the world we have data
            this.dataSourceStore.update(key, newResults);
          },
          err => {
            // Update the Store to tell the world we failed in every way. Shame.
            const errorResults: DataResults = {
              inflight: false,
              expiresWhen: new Date(),
              error: err.message
            };

            this.dataSourceStore.update(key, errorResults);
            this.logger.error(err, 'DataSource.Service.getDataSource', true);
          }
        );
    }

    return this.dataSourceQuery.selectEntity(key);
  }

  private getKey(dataRequest: DataSourceRequest) {
    return `name:${dataRequest.name} seed:${dataRequest.seed} inputData:${JSON.stringify(dataRequest.inputData)} `;
  }
}
