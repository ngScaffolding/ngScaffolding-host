import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { DataSourceRequest, DataSetResults, AppSettings } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private className = 'DataSourceService';

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService, private cacheService: CacheService, private logger: LoggingService) {}

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
}
