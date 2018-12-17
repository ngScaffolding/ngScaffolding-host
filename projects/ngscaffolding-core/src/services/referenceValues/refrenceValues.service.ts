import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { ReferenceValue } from '@ngscaffolding/models';
import { LoggingService } from '../logging/logging.service';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root',
})
export class ReferenceValuesService {
  private className = 'ReferenceValuesService';

  private requestsInFlight = new Map<string, Observable<ReferenceValue>>();

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private cacheService: CacheService,
    private logger: LoggingService
  ) {

  }

  //
  // Get a single string value from References
  //
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

  getReferenceGroup(group: string): Observable<Array<ReferenceValue>> {
    return new Observable<Array<ReferenceValue>>(observer => {
      this.http
        .get<Array<ReferenceValue>>(
          `${this.appSettingsService
            .apiHome}/api/v1/referencevalues?group=${group}`
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

  //
  // Get a complex ReferenceValue (May include multiple values)
  //
  getReferenceValue(name: string, seed = ''): Observable<ReferenceValue> {
    let retVal: ReferenceValue = null;

    retVal = this.cacheService.getValue(this.getKey(name, seed));

    if (retVal) {
      // If we get one from Cache, thats handy to use
      return new Observable<ReferenceValue>(observer => {
        observer.next(retVal);
        observer.complete();
      });
    } else {
      // Nothing in the Cache
      if (this.requestsInFlight.has(this.getKey(name, seed))) {
        // We have already asked for this, return our existing Observable
        return this.requestsInFlight.get(this.getKey(name, seed));
      } else {
        const wrapper = new Observable<ReferenceValue>(observer => {

          // Call HTTP Here
          const httpRequest = this.http.get<ReferenceValue>(
            `${this.appSettingsService
              .apiHome}/api/v1/referencevalues?name=${name}&seed=${seed}`
          );
          httpRequest.subscribe(value => {
            this.cacheService.setValue(this.getKey(name, seed), value);
            this.requestsInFlight.delete(this.getKey(name, seed));

            observer.next(value);
            observer.complete();
          });

          this.requestsInFlight.set(this.getKey(name, seed), wrapper);
        });

      return wrapper;
    }
  }
}


  private getKey(name: string, group: string): string {
    return `referenceValue::${name}::${group}`;
  }
}
