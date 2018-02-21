import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { ReferenceValue } from '../../models/referenceValue.model';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';

import { DataSourceRequest } from './dataSource.request.model';

@Injectable()
export class DataSourceService {
  private className = 'DataSourceService';

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private cacheService: CacheService,
    private logger: LoggingService
  ) {}

  getData(dataRequest: DataSourceRequest): Observable<any> {
    return new Observable<Array<any>>(observer => {
      this.http
        .post<Array<ReferenceValue>>(
          `${this.appSettingsService.apiHome}/api/datasource`,
          null
        )
        .subscribe(values => {
          observer.next(values);
          observer.complete();
        });
    });
  }
}
