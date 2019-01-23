import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { DataSourceRequest, DataSetResults, AppSettings } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';
import { DataSourceStore } from './dataSource.store';
import { DataSourceQuery } from './dataSource.query';

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
    private cacheService: CacheService,
    private logger: LoggingService
  ) {}

  getDataSource(dataRequest: DataSourceRequest): Observable<DataSetResults> {
    const key = this.getKey(dataRequest);

    const currentRequest = this.dataSourceQuery.getEntity(key);

    if (currentRequest === undefined || currentRequest.expires < new Date()) {
      const placeHolderResults: DataSetResults = {
        inflight: true,
        expires: new Date()
      };

      // Save as marker that the request has been sent
      this.dataSourceStore.createOrReplace(key, placeHolderResults);

      this.http.post<DataSetResults>(`${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/datasource`, dataRequest).subscribe(values => {
        const newResults: DataSetResults = {
          inflight: false,
          expires: new Date(),
          rowCount: values.rowCount,
          jsonData: values.jsonData,
          results: values.results
        };

        // Update the Store to tell the world we have data
        this.dataSourceStore.update(key, newResults);
      });
    }

    return this.dataSourceQuery.selectEntity(key);
  }

  getData(dataRequest: DataSourceRequest, throwOnError: boolean = false): Observable<DataSetResults> {
    return new Observable<DataSetResults>(singleObserver => {
      this.http.post<DataSetResults>(`${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/datasource`, dataRequest).subscribe(
        values => {
          // If Throw on error passed, loop through results for any failed runs
          if (throwOnError) {
            values.results.forEach(result => {
              if (!result.success) {
                singleObserver.error(result.message);
              }
            });
            singleObserver.next(values);
          } else {
            singleObserver.next(values);
          }

          // Finally
          singleObserver.complete();
        },
        err => {
          singleObserver.error(err);
        }
      );
    });
  }

  private getKey(dataRequest: DataSourceRequest) {
    return `name:${dataRequest.name} seed:${dataRequest.seed}`;
  }
}
