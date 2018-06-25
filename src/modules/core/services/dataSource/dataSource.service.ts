import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { ReferenceValue, DataSourceRequest, DataSetResults } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DataSourceService {
  private className = 'DataSourceService';

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private cacheService: CacheService,
    private logger: LoggingService
  ) {}

  getData(dataRequest: DataSourceRequest, throwOnError: boolean = false): Observable<DataSetResults> {
    return new Observable<DataSetResults>(observer => {
      this.http
        .post<DataSetResults>(
          `${this.appSettingsService.apiHome}/api/datasource`,
          dataRequest
        )
        .subscribe(values => {

          // If Throw on error passed, loop through results for any failed runs
          if (throwOnError) {
            values.results.forEach(result => {
              if (!result.success) {
                observer.error(result.message);
              }
            });
            observer.next(values);
          } else {
            observer.next(values);
          }

          // Finally
          observer.complete();
        });
    });
  }
}
