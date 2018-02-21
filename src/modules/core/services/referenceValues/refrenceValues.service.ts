import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { ReferenceValue } from '../../models/referenceValue.model';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ReferenceValuesService {
  private className = 'ReferenceValuesService';

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private cacheService: CacheService,
    private logger: LoggingService
  ) {
    setTimeout(() => {
      this.getAppSettingsFromServer();
    }, 50);
  }

  getValue(name: string, group: string): Observable<string> {
    return new Observable<string>(observer => {
      this.getReferenceValue(name, group).subscribe(reference => {
        if (reference) {
          observer.next(reference.value);
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }

  getAppSettingsFromServer() {
    this.logger.info('Loading AppSettings From Server', this.className);

    this.getReferenceGroup('appSettings').subscribe(values => {
      values.forEach(element => {
        this.logger.info(`Setting ${element.name} = ${element.value}`, this.className);

        this.appSettingsService[element.name] = element.value;
      });
    });
  }

  getReferenceGroup(group: string): Observable<Array<ReferenceValue>> {
    return new Observable<Array<ReferenceValue>>(observer => {
      this.http
        .get<Array<ReferenceValue>>(
          `${this.appSettingsService
            .apiHome}/api/referencevalues?group=${group}`
        )
        .subscribe(values => {
          // Save each returned value to our cache
          values.forEach(value =>
            this.cacheService.setValue(
              this.getKey(value.name, value.groupName),
              value.value
            )
          );

          observer.next(values);
          observer.complete();
        });
    });
  }

  getReferenceValue(name: string, seed = ''): Observable<ReferenceValue> {
    let retVal: ReferenceValue = null;

    retVal = this.cacheService.getValue(this.getKey(name, seed));

    if (retVal) {
      return new Observable<ReferenceValue>(observer => {
        observer.next(retVal);
        observer.complete();
      });
    } else {
      let obs = this.http.get<ReferenceValue>(
        `${this.appSettingsService
          .apiHome}/api/referencevalues?name=${name}&seed=${seed}`
      );
      obs.subscribe(value => {
        this.cacheService.setValue(this.getKey(name, seed), value);
      });

      return obs;
    }
  }

  private getKey(name: string, group: string): string {
    return `referenceValue::${name}::${group}`;
  }
}
